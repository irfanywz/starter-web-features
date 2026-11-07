/**
 * Penyimpanan persisten: meminta browser agar tidak menghapus
 * localStorage/IndexedDB secara otomatis saat disk hampir penuh.
 */
export async function isStoragePersisted(): Promise<boolean> {
  if (!navigator.storage?.persisted) return false;
  return navigator.storage.persisted();
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
