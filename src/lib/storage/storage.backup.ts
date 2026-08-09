import fs from "fs/promises";
import path from "path";

import os from "os";

const STORAGE_ROOT = path.join(os.tmpdir(), "knowledgehub_uploads");

/**
 * Saves a file to the local disk safely, avoiding filename collisions.
 * Directory structure: storage/uploads/{userId}/{filename}
 */
export async function saveFileLocally(
  userId: string,
  originalFileName: string,
  buffer: Buffer
): Promise<{ storedFileName: string; storagePath: string }> {
  // 1. Ensure the user's upload directory exists
  const userDir = path.join(STORAGE_ROOT, userId);
  await fs.mkdir(userDir, { recursive: true });

  // 2. Prevent collisions
  let storedFileName = originalFileName;
  let storagePath = path.join(userDir, storedFileName);
  let fileExists = true;

  try {
    await fs.access(storagePath);
  } catch {
    fileExists = false;
  }

  if (fileExists) {
    const ext = path.extname(originalFileName);
    const nameWithoutExt = path.basename(originalFileName, ext);
    const timestamp = Date.now();
    storedFileName = `${nameWithoutExt}_${timestamp}${ext}`;
    storagePath = path.join(userDir, storedFileName);
  }

  // 3. Write the file
  await fs.writeFile(storagePath, buffer);

  // Return the absolute path so the next function can find it in /tmp
  return { storedFileName, storagePath };
}
