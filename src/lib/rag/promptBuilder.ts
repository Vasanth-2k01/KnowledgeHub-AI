/**
 * Builds a plain-text RAG prompt for the LLM.
 * 
 * @param question The user's question
 * @param chunks The retrieved text chunks from the vector database
 * @param conversationHistory Optional array of previous messages for context
 * @returns A formatted string prompt
 */
export function buildRagPrompt(
  question: string, 
  chunks: string[],
  conversationHistory?: { role: string; content: string }[]
): string {
  const context = chunks.join("\n\n");

  let historyBlock = "";
  if (conversationHistory && conversationHistory.length > 0) {
    historyBlock = `--------------------\n\nCONVERSATION HISTORY\n\n`;
    historyBlock += conversationHistory.map(m => {
      const roleName = m.role === "user" ? "User" : "Assistant";
      return `${roleName}: ${m.content}`;
    }).join("\n");
    historyBlock += `\n\n`;
  }

  return `SYSTEM INSTRUCTIONS

You are an AI assistant answering questions using the provided knowledge base.
Use the conversation history to understand follow-up questions and references.
Use the retrieved context when answering questions about the uploaded documents.
Do not invent information that is not supported by the retrieved context.
If the answer cannot be found in the context, clearly say: "I couldn't find that information in the uploaded documents."
Do not mix conversation history and retrieved document context.

${historyBlock}--------------------

RETRIEVED CONTEXT

${context}

--------------------

CURRENT QUESTION

${question}

--------------------

ANSWER
`;
}
