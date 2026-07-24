import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuidv4 } from "uuid";

export interface Chunk {
  id: string;
  chunkIndex: number;
  text: string;
  characterCount: number;
  wordCount: number;
}

/**
 * Splits extracted text into structured chunks based on the provided configuration.
 *
 * @param text The raw extracted text to chunk.
 * @param chunkSize The maximum size of each chunk.
 * @param chunkOverlap The number of overlapping characters between chunks.
 * @returns An array of structured chunk objects.
 */
export async function chunkText(
  text: string,
  chunkSize: number,
  chunkOverlap: number
): Promise<Chunk[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const rawChunks = await splitter.createDocuments([text]);

  const structuredChunks: Chunk[] = rawChunks
    .map((doc, index) => {
      const chunkText = doc.pageContent.trim();
      
      if (!chunkText) return null;

      const wordCount = chunkText.split(/\s+/).filter((word) => word.length > 0).length;

      return {
        id: uuidv4(),
        chunkIndex: index,
        text: chunkText,
        characterCount: chunkText.length,
        wordCount,
      };
    })
    .filter((chunk): chunk is Chunk => chunk !== null);

  return structuredChunks;
}
