/**
 * Builds a plain-text RAG prompt for the LLM.
 * 
 * @param question The user's question
 * @param chunks The retrieved text chunks from the vector database
 * @returns A formatted string prompt
 */
export function buildRagPrompt(question: string, chunks: string[]): string {
  const context = chunks.join("\n\n");

  return `You are a helpful AI assistant.
Answer ONLY using the provided context.
If the answer cannot be found in the context, clearly say:
"I couldn't find that information in the uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;
}
