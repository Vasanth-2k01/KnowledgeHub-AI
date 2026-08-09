import { put, del } from '@vercel/blob';
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
      // For private Vercel Blobs, the standard URL cannot be fetched directly without the token.
      // We must fetch it and pass the token in the headers, or use standard fetch if we construct the URL properly,
      // but standard fetch doesn't use the SDK token automatically for reading private blobs.
      // Wait, @vercel/blob handles private blob reading by passing the token in fetch:
      const response = await fetch(storageKey, {
        headers: {
          authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blob, status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
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
