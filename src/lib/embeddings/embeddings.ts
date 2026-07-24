import { generateHuggingFaceEmbedding } from "./huggingface";

/**
 * Universal interface for generating embeddings.
 * Abstracts the underlying provider (Hugging Face, OpenAI, Gemini, etc.)
 * 
 * @param text The text chunk to embed
 * @param provider The name of the AI provider
 * @param model The specific model to use
 * @returns A promise that resolves to a dense numerical vector
 */
export async function generateEmbedding(
  text: string,
  provider: string,
  model: string
): Promise<number[]> {
  switch (provider.toLowerCase()) {
    case "huggingface":
      return await generateHuggingFaceEmbedding(text, model);
      
    // Future providers can be added here easily
    // case "openai":
    //   return await generateOpenAIEmbedding(text, model);
    // case "gemini":
    //   return await generateGeminiEmbedding(text, model);
      
    default:
      throw new Error(`Unsupported embedding provider: ${provider}`);
  }
}
