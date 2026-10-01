import { get, set, del } from 'idb-keyval';
import { StudioConversation, StudioMessage, ConversationGroup } from '@/types/chat';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const CONVERSATIONS_INDEX_KEY = 'mv_studio_conversations_meta_v1';
const CONVERSATION_MSG_KEY_PREFIX = 'mv_studio_convo_msgs_';
const LEGACY_SINGLE_CHAT_KEY = 'mv_director_studio_chat_history';

// Helper to interact with Firebase Firestore safely
const getFirebaseDb = () => {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    if (auth.currentUser) {
      const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      return { db, uid: auth.currentUser.uid };
    }
  } catch (e) {
    // Non-fatal, offline fallback
  }
  return null;
};

/**
 * Intelligent title generator from first user prompt
 * Example: "Help me create a Suno instrumental prompt" -> "Suno Instrumental Prompt"
 */
export const generateConversationTitle = (messageText: string, hasImage?: boolean, hasFiles?: boolean): string => {
  if (!messageText || !messageText.trim()) {
    if (hasImage) return 'Image Reference Discussion';
    if (hasFiles) return 'Attached File Analysis';
    return 'New Conversation';
  }

  let cleaned = messageText
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/^[\s\W_]+/, '') // Leading punctuation
    .replace(/\s+/g, ' ')
    .trim();

  // Strip common conversational filler prefixes
  const prefixPatterns = [
    /^(could you\s+(please\s+)?(help\s+me\s+)?(to\s+)?)/i,
    /^(can you\s+(please\s+)?(help\s+me\s+)?(to\s+)?)/i,
    /^(please\s+(help\s+me\s+)?(to\s+)?)/i,
    /^(help\s+me\s+(to\s+)?(create|make|write|generate|design|build|draft|plan|code)?\s*)/i,
    /^(i\s+need\s+(you\s+to\s+)?(help\s+me\s+)?(a\s+|an\s+)?)/i,
    /^(i\s+want\s+(to\s+)?(a\s+|an\s+)?)/i,
    /^(how\s+(do\s+i|can\s+i|to)\s+)/i,
    /^(tell\s+me\s+about\s+)/i,
    /^(explain\s+(to\s+me\s+)?)/i,
    /^(write\s+(me\s+)?(a\s+|an\s+)?)/i,
    /^(create\s+(me\s+)?(a\s+|an\s+)?)/i,
    /^(generate\s+(me\s+)?(a\s+|an\s+)?)/i,
  ];

  for (const pat of prefixPatterns) {
    cleaned = cleaned.replace(pat, '').trim();
  }

  if (!cleaned) {
    return 'Creative Production Chat';
  }

  // Capitalize sentence or title words nicely
  const words = cleaned.split(' ').slice(0, 7);
  let title = words.join(' ');

  // Truncate to max ~38 chars on word boundary
  if (title.length > 38) {
    title = title.substring(0, 38).replace(/\s+\S*$/, '') + '...';
  }

  // Capitalize first letter of significant words
  title = title
    .split(' ')
    .map((w, idx) => {
      if (idx === 0 || w.length > 3) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }
      return w;
    })
    .join(' ');

  return title || 'New Conversation';
};

/**
 * Loads the list of all conversations, running migration if legacy single chat exists
 */
export const loadConversationsList = async (): Promise<StudioConversation[]> => {
  try {
    let list: StudioConversation[] | null = null;

    // 1. Try Firestore if authenticated
    const fb = getFirebaseDb();
    if (fb) {
      try {
        const docRef = doc(fb.db, 'users', fb.uid, 'studio_chat', 'conversations');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.conversations)) {
            list = data.conversations;
            await set(CONVERSATIONS_INDEX_KEY, list);
          }
        }
      } catch (err) {
        console.warn('Could not load conversations from Firestore:', err);
      }
    }

    // 2. Fallback to IndexedDB
    if (!list) {
      list = (await get<StudioConversation[]>(CONVERSATIONS_INDEX_KEY)) || null;
    }

    // 3. If no conversations exist, check for legacy single chat migration
    if (!list || list.length === 0) {
      const legacyMsgs = (await get<any[]>(LEGACY_SINGLE_CHAT_KEY)) || null;
      let legacyParsed = legacyMsgs;
      if (!legacyParsed) {
        const localLegacy = localStorage.getItem(LEGACY_SINGLE_CHAT_KEY);
        if (localLegacy) {
          try {
            legacyParsed = JSON.parse(localLegacy);
          } catch {}
        }
      }

      if (legacyParsed && Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        const convoId = `convo_${Date.now()}`;
        const firstUserMsg = legacyParsed.find(m => m.sender === 'user');
        const initialTitle = firstUserMsg 
          ? generateConversationTitle(firstUserMsg.text, Boolean(firstUserMsg.attachedImage), Boolean(firstUserMsg.attachments?.length))
          : 'Imported Conversation';
        
        const lastMsg = legacyParsed[legacyParsed.length - 1];
        const preview = lastMsg?.text ? lastMsg.text.slice(0, 80).replace(/\n/g, ' ') : '';

        const migratedConvo: StudioConversation = {
          id: convoId,
          title: initialTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastMessagePreview: preview,
          messageCount: legacyParsed.length,
          isArchived: false,
        };

        const migratedMessages: StudioMessage[] = legacyParsed.map((m, idx) => ({
          ...m,
          id: m.id || `${Date.now()}_${idx}`,
          conversationId: convoId,
          createdAt: m.createdAt || new Date().toISOString(),
        }));

        await set(`${CONVERSATION_MSG_KEY_PREFIX}${convoId}`, migratedMessages);
        list = [migratedConvo];
        await set(CONVERSATIONS_INDEX_KEY, list);

        // Clean legacy keys
        await del(LEGACY_SINGLE_CHAT_KEY);
        localStorage.removeItem(LEGACY_SINGLE_CHAT_KEY);
        return list;
      }

      list = [];
    }

    // Sort by updatedAt descending
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to load conversations list:', error);
    return [];
  }
};

/**
 * Persists the list of conversation metadata
 */
export const saveConversationsList = async (conversations: StudioConversation[]): Promise<void> => {
  try {
    // 1. Save to IndexedDB
    await set(CONVERSATIONS_INDEX_KEY, conversations);

    // 2. Background sync to Firestore if authenticated
    const fb = getFirebaseDb();
    if (fb) {
      const docRef = doc(fb.db, 'users', fb.uid, 'studio_chat', 'conversations');
      setDoc(docRef, { conversations, updatedAt: new Date().toISOString() }).catch(err => {
        console.warn('Background Firestore sync for conversations failed:', err);
      });
    }
  } catch (error) {
    console.error('Failed to save conversations list:', error);
  }
};

/**
 * Loads messages for a specific conversation
 */
export const loadConversationMessages = async (conversationId: string): Promise<StudioMessage[]> => {
  if (!conversationId) return [];
  try {
    // 1. Try Firestore if authenticated
    const fb = getFirebaseDb();
    if (fb) {
      try {
        const docRef = doc(fb.db, 'users', fb.uid, 'studio_chat_messages', conversationId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.messages)) {
            await set(`${CONVERSATION_MSG_KEY_PREFIX}${conversationId}`, data.messages);
            return data.messages;
          }
        }
      } catch (err) {
        // Fallback to local
      }
    }

    // 2. Load from IndexedDB
    const messages = await get<StudioMessage[]>(`${CONVERSATION_MSG_KEY_PREFIX}${conversationId}`);
    return messages || [];
  } catch (error) {
    console.error(`Failed to load messages for conversation ${conversationId}:`, error);
    return [];
  }
};

/**
 * Persists messages for a specific conversation
 */
export const saveConversationMessages = async (conversationId: string, messages: StudioMessage[]): Promise<void> => {
  if (!conversationId) return;
  try {
    // 1. Save to IndexedDB
    await set(`${CONVERSATION_MSG_KEY_PREFIX}${conversationId}`, messages);

    // 2. Background sync to Firestore if authenticated
    const fb = getFirebaseDb();
    if (fb) {
      const docRef = doc(fb.db, 'users', fb.uid, 'studio_chat_messages', conversationId);
      // Clean undefined values or large blobs for Firestore
      const sanitizedMessages = messages.map(m => ({
        id: m.id,
        conversationId: m.conversationId,
        text: m.text || '',
        sender: m.sender,
        createdAt: m.createdAt || new Date().toISOString(),
        agentPersona: m.agentPersona || null,
        agentName: m.agentName || null,
        isLoopComplete: m.isLoopComplete || false,
        loopStepNumber: m.loopStepNumber || null,
        loopTotalSteps: m.loopTotalSteps || null,
        // Exclude huge base64 images from Firestore to stay under 1MB document limit
        attachedImage: m.attachedImage && m.attachedImage.length < 50000 ? m.attachedImage : null,
        generatedImageUrl: m.generatedImageUrl || null,
      }));

      setDoc(docRef, { messages: sanitizedMessages, updatedAt: new Date().toISOString() }).catch(err => {
        console.warn(`Firestore sync for messages in ${conversationId} failed:`, err);
      });
    }
  } catch (error) {
    console.error(`Failed to save messages for conversation ${conversationId}:`, error);
  }
};

/**
 * Deletes a conversation and its messages
 */
export const deleteConversationFromDB = async (conversationId: string): Promise<StudioConversation[]> => {
  try {
    // 1. Remove messages
    await del(`${CONVERSATION_MSG_KEY_PREFIX}${conversationId}`);

    // 2. Remove from conversations list
    const currentList = await loadConversationsList();
    const updatedList = currentList.filter(c => c.id !== conversationId);
    await saveConversationsList(updatedList);

    // 3. Firestore delete if authenticated
    const fb = getFirebaseDb();
    if (fb) {
      deleteDoc(doc(fb.db, 'users', fb.uid, 'studio_chat_messages', conversationId)).catch(() => {});
    }

    return updatedList;
  } catch (error) {
    console.error(`Failed to delete conversation ${conversationId}:`, error);
    return [];
  }
};

/**
 * Helper to group conversations by date:
 * - Today
 * - Yesterday
 * - Previous 7 Days
 * - Older
 */
export const groupConversationsByDate = (conversations: StudioConversation[]): ConversationGroup[] => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOfPrevious7Days = startOfToday - 7 * 24 * 60 * 60 * 1000;

  const today: StudioConversation[] = [];
  const yesterday: StudioConversation[] = [];
  const previous7Days: StudioConversation[] = [];
  const older: StudioConversation[] = [];

  for (const convo of conversations) {
    const convoTime = new Date(convo.updatedAt || convo.createdAt).getTime();

    if (convoTime >= startOfToday) {
      today.push(convo);
    } else if (convoTime >= startOfYesterday) {
      yesterday.push(convo);
    } else if (convoTime >= startOfPrevious7Days) {
      previous7Days.push(convo);
    } else {
      older.push(convo);
    }
  }

  const groups: ConversationGroup[] = [];

  if (today.length > 0) {
    groups.push({ category: 'today', label: 'Today', conversations: today });
  }
  if (yesterday.length > 0) {
    groups.push({ category: 'yesterday', label: 'Yesterday', conversations: yesterday });
  }
  if (previous7Days.length > 0) {
    groups.push({ category: 'previous_7_days', label: 'Previous 7 Days', conversations: previous7Days });
  }
  if (older.length > 0) {
    groups.push({ category: 'older', label: 'Older', conversations: older });
  }

  return groups;
};

/**
 * Format relative or compact timestamp for conversation item
 */
export const formatConversationTimestamp = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
      return 'Yesterday';
    }

    if (diffHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};
