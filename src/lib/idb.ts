/**
 * Wrapper IndexedDB kecil berbasis key-value.
 * Dipakai untuk menyimpan benda yang tidak bisa masuk localStorage,
 * misalnya FileSystemDirectoryHandle.
 */
const DB_NAME = "app-db";
const STORE_NAME = "kv";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<R>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<R>
): Promise<R> {
  const db = await openDb();
  return new Promise<R>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = action(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export const idb = {
  get: <T>(key: string) => run<T | undefined>("readonly", (store) => store.get(key)),

  set: async (key: string, value: unknown): Promise<void> => {
    await run("readwrite", (store) => store.put(value, key));
  },

  del: async (key: string): Promise<void> => {
    await run("readwrite", (store) => store.delete(key));
  },
};
