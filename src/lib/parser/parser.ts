import { ParsedDocument } from './types';
import { parsePdf } from './pdf';
import { parseDocx } from './docx';
import { parseText } from './text';
import { parseMarkdown } from './markdown';

/**
 * Extracts plain text from a given file buffer based on its file extension or MIME type.
 * 
 * @param buffer - The raw file buffer.
 * @param mimeType - The MIME type of the file.
 * @param extension - The file extension (e.g., '.pdf', '.docx').
 * @returns A promise resolving to the ParsedDocument object containing the extracted text and metrics.
 */
export async function extractText(buffer: Buffer, mimeType: string, extension: string): Promise<ParsedDocument> {
  if (buffer.length === 0) {
    throw new Error("Empty document");
  }

  const ext = extension.toLowerCase();
  
  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return parsePdf(buffer);
  }
  
  if (
    ext === '.docx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return parseDocx(buffer);
  }
  
  if (ext === '.txt' || mimeType === 'text/plain') {
    return parseText(buffer);
  }
  
  if (ext === '.md' || mimeType === 'text/markdown') {
    return parseMarkdown(buffer);
  }
  
  throw new Error(`Unsupported file type: ${mimeType} or ${extension}`);
}
