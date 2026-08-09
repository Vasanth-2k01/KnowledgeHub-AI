import { FileStorage } from './types';
import { LocalFileStorage } from './local';
import { VercelBlobStorage } from './vercelBlob';

// Singleton instances
let localInstance: LocalFileStorage | null = null;
let vercelBlobInstance: VercelBlobStorage | null = null;

export function getFileStorage(provider?: string): FileStorage {
  // Determine provider from argument or environment
  const activeProvider = provider || process.env.STORAGE_PROVIDER || 'local';

  if (activeProvider === 'vercel-blob') {
    if (!vercelBlobInstance) {
      vercelBlobInstance = new VercelBlobStorage();
    }
    return vercelBlobInstance;
  }

  if (activeProvider === 'local') {
    if (!localInstance) {
      localInstance = new LocalFileStorage();
    }
    return localInstance;
  }

  throw new Error(`Unsupported storage provider configured: ${activeProvider}`);
}
