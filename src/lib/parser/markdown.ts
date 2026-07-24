import { ParsedDocument, calculateStats } from './types';

export async function parseMarkdown(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const text = buffer.toString('utf-8');
    const { wordCount, characterCount } = calculateStats(text);
    
    return {
      text,
      wordCount,
      characterCount,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse Markdown: ${error.message}`);
  }
}
