export interface ParsedDocument {
  text: string;
  pageCount?: number;
  wordCount: number;
  characterCount: number;
}

export function calculateStats(text: string) {
  const characterCount = text.length;
  // A simple word count splitting by whitespace
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  
  return { characterCount, wordCount };
}
