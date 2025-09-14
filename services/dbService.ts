
const DB_NAME = 'AiSocialNinjaAnimeStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
            reject("Error opening IndexedDB.");
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

const getStore = (mode: IDBTransactionMode) => {
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
};

export const saveVideo = (id: string, blob: Blob): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore('readwrite');
        const request = store.put(blob, id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
};

export const getVideo = (id: string): Promise<Blob | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore('readonly');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result as Blob | undefined);
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
};

export const deleteVideo = (id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore('readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
};

export const clearVideos = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore('readwrite');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
};
