import { put, del, get } from '@vercel/blob';
import path from 'path';
import { FileStorage, StoredFile, StorageError } from './types';

export class VercelBlobStorage implements FileStorage {
  private readonly providerName = 'vercel-blob';

  constructor() {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('WARNING: BLOB_READ_WRITE_TOKEN is missing in the environment variables.');
    }
  }

  async upload(userId: string, originalFileName: string, buffer: Buffer): Promise<StoredFile> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new StorageError('BLOB_READ_WRITE_TOKEN is not configured', this.providerName);
    }

    try {
      // Generate a safe unique filename
      const ext = path.extname(originalFileName);
      const safeBaseName = path.basename(originalFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const storedFileName = `${safeBaseName}_${timestamp}${ext}`;
      
      const blobPath = `uploads/${userId}/${storedFileName}`;

      const blob = await put(blobPath, buffer, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return {
        storedFileName: originalFileName, // keep original for reference
        storagePath: blob.url, // For @vercel/blob, the URL is commonly used as the key for deletion/reading
        storageProvider: this.providerName,
      };
    } catch (error: any) {
      throw new StorageError(`Vercel Blob upload failed: ${error.message}`, this.providerName);
    }
  }

  async get(storageKey: string): Promise<Buffer> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new StorageError('BLOB_READ_WRITE_TOKEN is not configured', this.providerName);
    }

    try {
      const result = await get(storageKey, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      if (!result || result.statusCode === 304 || !result.stream) {
        throw new Error('Blob not found');
      }

      const arrayBuffer = await new Response(result.stream).arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      throw new StorageError(`Vercel Blob read failed: ${error.message}`, this.providerName);
    }
  }

  async delete(storageKey: string): Promise<void> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new StorageError('BLOB_READ_WRITE_TOKEN is not configured', this.providerName);
    }

    try {
      await del(storageKey, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    } catch (error: any) {
      throw new StorageError(`Vercel Blob delete failed: ${error.message}`, this.providerName);
    }
  }
}
