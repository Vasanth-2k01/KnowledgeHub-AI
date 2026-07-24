import { HfInference } from "@huggingface/inference";

/**
 * Generates an embedding for a given text using Hugging Face's Inference API.
 * 
 * @param text The chunk of text to embed
 * @param model The specific Hugging Face model string (e.g. "BAAI/bge-small-en-v1.5")
 * @returns An array of numbers representing the dense vector
 */
export async function generateHuggingFaceEmbedding(
  text: string,
  model: string
): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing HUGGINGFACE_API_KEY environment variable.");
  }

  const hf = new HfInference(apiKey);

  try {
    const output = await hf.featureExtraction({
      model: model,
      inputs: text,
    });

    // The output could be a nested array depending on the model and inputs
    // We expect a flat number[] for a single text input
    let vector: number[];
    if (Array.isArray(output) && Array.isArray(output[0])) {
        // In case it returns an array of arrays [[...]]
        vector = output[0] as number[];
    } else {
        // Direct array [...]
        vector = output as number[];
    }

    if (!Array.isArray(vector) || vector.length === 0 || typeof vector[0] !== 'number') {
      throw new Error(`Invalid embedding returned from Hugging Face model: ${model}`);
    }

    return vector;
  } catch (error: any) {
    throw new Error(`Hugging Face API failure: ${error.message}`);
  }
}
