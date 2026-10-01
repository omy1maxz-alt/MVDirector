
import { ProjectData, DirectorPlan } from "../types";

const DB_NAME = 'MVDirectorDB_v1';
const DB_VERSION = 1;
const STORES = {
  PROJECT: 'project_store',
  PLAN: 'plan_store'
};
const KEYS = {
  CURRENT_PROJECT: 'current_project',
  CURRENT_PLAN: 'current_plan'
};

const isDBAvailable = () => {
    try {
        return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
    } catch (e) {
        return false;
    }
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isDBAvailable()) {
        reject(new Error("IndexedDB not available"));
        return;
    }

    try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error || new Error("Unknown DB Error"));
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORES.PROJECT)) {
            db.createObjectStore(STORES.PROJECT);
          }
          if (!db.objectStoreNames.contains(STORES.PLAN)) {
            db.createObjectStore(STORES.PLAN);
          }
        };
    } catch (e) {
        reject(e);
    }
  });
};

export const saveProjectToDB = async (data: ProjectData): Promise<void> => {
  if (!isDBAvailable()) return;
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.PROJECT], 'readwrite');
        const store = transaction.objectStore(STORES.PROJECT);
        const request = store.put(data, KEYS.CURRENT_PROJECT);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.warn("DB Save failed:", e);
      return;
  }
};

export const loadProjectFromDB = async (): Promise<ProjectData | null> => {
  if (!isDBAvailable()) return null;
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.PROJECT], 'readonly');
        const store = transaction.objectStore(STORES.PROJECT);
        const request = store.get(KEYS.CURRENT_PROJECT);
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.warn("DB Load failed:", e);
      return null;
  }
};

export const savePlanToDB = async (data: DirectorPlan): Promise<void> => {
  if (!isDBAvailable()) return;
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.PLAN], 'readwrite');
        const store = transaction.objectStore(STORES.PLAN);
        const request = store.put(data, KEYS.CURRENT_PLAN);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.warn("DB Plan Save failed:", e);
      return;
  }
};

export const loadPlanFromDB = async (): Promise<DirectorPlan | null> => {
  if (!isDBAvailable()) return null;
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.PLAN], 'readonly');
        const store = transaction.objectStore(STORES.PLAN);
        const request = store.get(KEYS.CURRENT_PLAN);
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.warn("DB Plan Load failed:", e);
      return null;
  }
};

export const clearDB = async (): Promise<void> => {
    if (!isDBAvailable()) return;
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORES.PROJECT, STORES.PLAN], 'readwrite');
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = () => {
                reject(transaction.error || new Error("DB Clear Transaction Failed"));
            };
            transaction.objectStore(STORES.PROJECT).clear();
            transaction.objectStore(STORES.PLAN).clear();
        });
    } catch (e) {
        console.warn("DB Clear failed", e);
        throw e;
    }
};
