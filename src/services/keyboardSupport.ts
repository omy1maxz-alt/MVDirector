/**
 * Hacker's Keyboard & Virtual/Physical Keyboard Modifier Helper for Android WebViews.
 * 
 * Android WebViews frequently fail to execute default desktop keyboard shortcuts when virtual keyboards
 * (like Hacker's Keyboard) send synthetic modifier key combinations (Ctrl+A, Ctrl+Shift+Home/End, Ctrl+V).
 * This service ensures inputs and textareas react immediately to text selection and clipboard operations.
 */

let isInitialized = false;

export function initKeyboardSupport(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  window.addEventListener(
    'keydown',
    async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput = target.tagName === 'INPUT';
      const isTextarea = target.tagName === 'TEXTAREA';
      const isEditable = target.isContentEditable || isInput || isTextarea;

      if (!isEditable) return;

      const inputElement = (isInput || isTextarea) ? (target as HTMLInputElement | HTMLTextAreaElement) : null;
      const isCtrl = e.ctrlKey || e.metaKey;

      if (!isCtrl) return;

      const key = e.key.toLowerCase();

      // 1. Ctrl + A -> Select All
      if (key === 'a' && !e.shiftKey && !e.altKey) {
        if (inputElement) {
          e.preventDefault();
          try {
            inputElement.focus();
            inputElement.setSelectionRange(0, inputElement.value.length);
            console.info(`[HackerKeyboard] Ctrl+A Select All executed on <${target.tagName.toLowerCase()}> (len: ${inputElement.value.length})`);
          } catch (err) {
            console.warn('[HackerKeyboard] Failed to select all:', err);
          }
        }
        return;
      }

      // 2. Ctrl + Shift + Home -> Select to beginning
      if (e.shiftKey && (e.key === 'Home' || e.key === 'ArrowUp') && inputElement) {
        e.preventDefault();
        try {
          const currentEnd = inputElement.selectionEnd ?? inputElement.value.length;
          inputElement.setSelectionRange(0, currentEnd, 'backward');
          console.info(`[HackerKeyboard] Ctrl+Shift+Home selected 0..${currentEnd}`);
        } catch (err) {
          console.warn('[HackerKeyboard] Selection range error:', err);
        }
        return;
      }

      // 3. Ctrl + Shift + End -> Select to end
      if (e.shiftKey && (e.key === 'End' || e.key === 'ArrowDown') && inputElement) {
        e.preventDefault();
        try {
          const currentStart = inputElement.selectionStart ?? 0;
          inputElement.setSelectionRange(currentStart, inputElement.value.length, 'forward');
          console.info(`[HackerKeyboard] Ctrl+Shift+End selected ${currentStart}..${inputElement.value.length}`);
        } catch (err) {
          console.warn('[HackerKeyboard] Selection range error:', err);
        }
        return;
      }

      // 4. Ctrl + Home -> Move cursor to start
      if (!e.shiftKey && e.key === 'Home' && inputElement) {
        e.preventDefault();
        inputElement.setSelectionRange(0, 0);
        return;
      }

      // 5. Ctrl + End -> Move cursor to end
      if (!e.shiftKey && e.key === 'End' && inputElement) {
        e.preventDefault();
        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        return;
      }

      // 6. Ctrl + V -> Paste fallback for Android WebView
      if (key === 'v' && !e.shiftKey && !e.altKey && inputElement) {
        // Allow native paste event to attempt first; if Android clipboard API is accessible, ensure it pastes
        if (navigator.clipboard && navigator.clipboard.readText) {
          try {
            const clipText = await navigator.clipboard.readText();
            if (clipText) {
              const start = inputElement.selectionStart ?? inputElement.value.length;
              const end = inputElement.selectionEnd ?? inputElement.value.length;
              const val = inputElement.value;
              const nextVal = val.slice(0, start) + clipText + val.slice(end);

              // Update input value via native setter so React state updates trigger correctly
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window[isInput ? 'HTMLInputElement' : 'HTMLTextAreaElement'].prototype,
                'value'
              )?.set;

              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(inputElement, nextVal);
              } else {
                inputElement.value = nextVal;
              }

              // Set cursor position after pasted text
              const newPos = start + clipText.length;
              inputElement.setSelectionRange(newPos, newPos);

              // Dispatch input & change events for React listeners
              inputElement.dispatchEvent(new Event('input', { bubbles: true }));
              inputElement.dispatchEvent(new Event('change', { bubbles: true }));

              console.info(`[HackerKeyboard] Ctrl+V injected ${clipText.length} chars into <${target.tagName.toLowerCase()}>`);
              e.preventDefault();
            }
          } catch (clipErr) {
            // Permission not granted or native handled
            console.log('[HackerKeyboard] Clipboard readText fallback skipped (native handler active):', clipErr);
          }
        }
      }
    },
    { capture: true }
  );

  console.info('[HackerKeyboard] Android modifier key shortcuts & clipboard helper initialized.');
}
