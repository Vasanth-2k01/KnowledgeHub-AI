// @ts-ignore - Mammoth types might be missing
import mammoth from 'mammoth';
import { ParsedDocument, calculateStats } from './types';

export async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';
    const { wordCount, characterCount } = calculateStats(text);
    
    return {
      text,
      wordCount,
      characterCount,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}
