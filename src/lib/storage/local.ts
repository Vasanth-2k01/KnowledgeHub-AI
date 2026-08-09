import fs from 'fs/promises';
import path from 'path';
import { FileStorage, StoredFile, StorageError } from './types';

export class LocalFileStorage implements FileStorage {
  private readonly storageRoot: string;
  private readonly providerName = 'local';

  constructor() {
    // Relative to project root
    this.storageRoot = path.join(process.cwd(), 'storage', 'uploads');
  }

  async upload(userId: string, originalFileName: string, buffer: Buffer): Promise<StoredFile> {
    try {
      const userDir = path.join(this.storageRoot, userId);
      await fs.mkdir(userDir, { recursive: true });

      // Generate a safe unique filename
      const ext = path.extname(originalFileName);
      const safeBaseName = path.basename(originalFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const storedFileName = `${safeBaseName}_${timestamp}${ext}`;
      
      // Store relative to the uploads folder to prevent absolute path coupling
      const relativeStorageKey = path.posix.join(userId, storedFileName);
      const absoluteStoragePath = path.join(this.storageRoot, userId, storedFileName);

      await fs.writeFile(absoluteStoragePath, buffer);

      return {
        storedFileName,
        storagePath: relativeStorageKey,
        storageProvider: this.providerName,
      };
    } catch (error: any) {
      throw new StorageError(`Local upload failed: ${error.message}`, this.providerName);
    }
  }

  private getAbsolutePath(storageKey: string): string {
    // Prevent path traversal
    const normalizedKey = path.normalize(storageKey).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(this.storageRoot, normalizedKey);
  }

  async get(storageKey: string): Promise<Buffer> {
    try {
      const absolutePath = this.getAbsolutePath(storageKey);
      return await fs.readFile(absolutePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new StorageError(`File not found: ${storageKey}`, this.providerName);
      }
      throw new StorageError(`Local read failed: ${error.message}`, this.providerName);
    }
  }

  async delete(storageKey: string): Promise<void> {
    try {
      const absolutePath = this.getAbsolutePath(storageKey);
      await fs.unlink(absolutePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw new StorageError(`Local delete failed: ${error.message}`, this.providerName);
      }
    }
  }
}
