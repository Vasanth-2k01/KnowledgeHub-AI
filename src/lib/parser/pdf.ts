import { ParsedDocument, calculateStats } from './types';
import type pdfParseModule from 'pdf-parse';
import pdfParseInternal from 'pdf-parse/lib/pdf-parse.js';

const pdfParse = pdfParseInternal as typeof pdfParseModule;

export async function parsePdf(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const data = await pdfParse(buffer);
    const text = data.text || '';
    const { wordCount, characterCount } = calculateStats(text);
    
    return {
      text,
      pageCount: data.numpages,
      wordCount,
      characterCount,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}
