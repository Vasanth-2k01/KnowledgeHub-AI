import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "uploads");

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

  // Return the relative path to be stored in the DB (for easier portability if absolute paths change)
  const relativePath = path.posix.join("storage", "uploads", userId, storedFileName);

  return { storedFileName, storagePath: relativePath };
}
