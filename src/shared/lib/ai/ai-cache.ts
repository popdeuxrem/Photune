/**
 * Browser-local AI cache for string responses.
 * No external dependency required.
 */

type CacheEntry = {
  key: string;
  value: string;
  timestamp: number;
  ttlMs: number;
};

const DB_NAME = 'photune_ai_cache';
const STORE_NAME = 'inferences';
const VERSION = 1;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore, db: IDBDatabase) => Promise<T> | T
): Promise<T> {
  const db = await openDatabase();

  try {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = await fn(store, db);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    });

    return result;
  } finally {
    db.close();
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export const AICacheService = {
  async get(key: string): Promise<string | null> {
    if (!isBrowser()) return null;

    try {
      return await withStore('readwrite', async (store) => {
        const entry = await requestToPromise(store.get(key) as IDBRequest<CacheEntry | undefined>);

        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
        if (isExpired) {
          store.delete(key);
          return null;
        }

        return entry.value;
      });
    } catch (error) {
      console.warn('AI cache get failed:', error);
      return null;
    }
  },

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    if (!isBrowser()) return;

    try {
      await withStore('readwrite', async (store) => {
        const entry: CacheEntry = {
          key,
          value,
          timestamp: Date.now(),
          ttlMs,
        };
        store.put(entry);
      });
    } catch (error) {
      console.warn('AI cache set failed:', error);
    }
  },

  async prune(maxAgeMs: number): Promise<void> {
    if (!isBrowser()) return;

    try {
      await withStore('readwrite', async (store) => {
        const index = store.index('timestamp');
        const cutoff = Date.now() - maxAgeMs;
        const range = IDBKeyRange.upperBound(cutoff);
        const request = index.openCursor(range);

        await new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor) {
              resolve();
              return;
            }
            cursor.delete();
            cursor.continue();
          };
          request.onerror = () =>
            reject(request.error ?? new Error('AI cache prune failed'));
        });
      });
    } catch (error) {
      console.warn('AI cache prune failed:', error);
    }
  },
};