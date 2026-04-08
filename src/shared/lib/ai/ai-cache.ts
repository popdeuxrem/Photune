/**
 * Browser-local AI cache for string responses.
 * Uses salted hashing to prevent cache key collisions across model versions.
 * Enforces TTL-aware eviction to maintain freshness.
 * No external dependency required.
 */

type CacheEntry = {
  key: string;
  value: string;
  timestamp: number;
  ttlMs: number;
  model?: string;
  version?: string;
};

type CacheKeyOptions = {
  model?: string;
  version?: string;
};

// Default cache TTL: 60 minutes
const DEFAULT_TTL_MS = 60 * 60 * 1000;
// Max cache size: 500 entries
const MAX_CACHE_ENTRIES = 500;

const DB_NAME = 'photune_ai_cache';
const STORE_NAME = 'inferences';
const VERSION = 1;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

/**
 * Generate salted cache key to prevent collisions across models/versions.
 * Combines user prompt with model identifier for uniqueness.
 */
async function generateSaltedCacheKey(
  baseKey: string,
  options?: CacheKeyOptions,
): Promise<string> {
  const salt = `${options?.model || 'default'}:${options?.version || '1.0'}`;
  const combined = `${baseKey}|${salt}`;
  
  // Use SubtleCrypto if available for true hashing, fallback to simple encoding
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buffer = new TextEncoder().encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return 'sk_' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
    } catch {
      // Fallback
    }
  }
  
  // Fallback to simple base64 encoding if SubtleCrypto unavailable
  return 'sk_' + btoa(combined).substring(0, 32);
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
  async get(key: string, options?: CacheKeyOptions): Promise<string | null> {
    if (!isBrowser()) return null;

    try {
      const saltedKey = await generateSaltedCacheKey(key, options);
      
      return await withStore('readwrite', async (store) => {
        const entry = await requestToPromise(store.get(saltedKey) as IDBRequest<CacheEntry | undefined>);

        if (!entry) return null;

        // Check TTL expiration
        const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
        if (isExpired) {
          store.delete(saltedKey);
          return null;
        }

        return entry.value;
      });
    } catch (error) {
      console.warn('AI cache get failed:', error);
      return null;
    }
  },

  async set(
    key: string,
    value: string,
    ttlMs: number = DEFAULT_TTL_MS,
    options?: CacheKeyOptions,
  ): Promise<void> {
    if (!isBrowser()) return;

    try {
      const saltedKey = await generateSaltedCacheKey(key, options);
      
      await withStore('readwrite', async (store) => {
        // Auto-evict oldest entries if cache is full
        const countRequest = (store as any).count?.() as IDBRequest<number> | undefined;
        if (countRequest) {
          const count = await requestToPromise(countRequest);
          if (count >= MAX_CACHE_ENTRIES) {
            // Delete oldest entry
            const index = store.index('timestamp');
            const cursor = await requestToPromise(index.openCursor() as IDBRequest<IDBCursorWithValue | null>);
            if (cursor) {
              store.delete(cursor.key);
            }
          }
        }

        const entry: CacheEntry = {
          key: saltedKey,
          value,
          timestamp: Date.now(),
          ttlMs,
          model: options?.model,
          version: options?.version,
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
