export interface StoredFile {
  storedFileName: string;
  storagePath: string; // The key/path used to retrieve it later
  storageProvider: string;
}

export interface FileStorage {
  /**
   * Upload a file from a Buffer.
   */
  upload(
    userId: string,
    originalFileName: string,
    buffer: Buffer
  ): Promise<StoredFile>;

  /**
   * Retrieve a file as a Buffer using its storage key.
   */
  get(storageKey: string): Promise<Buffer>;

  /**
   * Delete a file from storage.
   */
  delete(storageKey: string): Promise<void>;
}

export class StorageError extends Error {
  constructor(message: string, public provider: string) {
    super(message);
    this.name = 'StorageError';
  }
}
