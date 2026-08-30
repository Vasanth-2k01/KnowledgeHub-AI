import { CitationSource } from "@/services/search/semanticSearch";

/**
 * Builds a plain-text RAG prompt for the LLM.
 * 
 * @param question The user's question
 * @param sources The retrieved citation sources from the vector database
 * @param conversationHistory Optional array of previous messages for context
 * @returns A formatted string prompt
 */
export function buildRagPrompt(
  question: string, 
  sources: CitationSource[],
  conversationHistory?: { role: string; content: string }[]
): string {
  const context = sources.map(s => `[Source: ${s.id}]\nDocument: ${s.fileName}\nChunk: ${s.chunkIndex ?? 0}\nContent:\n${s.content}`).join("\n\n");

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

Response Formatting Instructions:
Format your answer using clean Markdown when appropriate.

Guidelines:
- Use headings (##, ###) ONLY if the response has 2 or more clearly separate sections.
- Use bullet points ONLY for genuinely enumerable items (3 or more distinct things). Do NOT use bullets for flowing prose, explanations, or single-item answers.
- Prefer paragraphs over bullet points when the answer is explanatory.
- Do NOT start every sentence as a bullet point.
- Use numbered lists for sequential steps or instructions.
- Use Markdown tables when comparing multiple items or presenting structured information.
- Use bold for important terms when helpful.
- Use inline code for technical terms such as function names, variables, APIs, commands, and file names.
- Use fenced code blocks with the appropriate language for programming code.
- Use blockquotes for important notes or quotations when appropriate.
- Keep paragraphs concise and readable. Keep the answer natural — avoid padding.
- Do not output raw HTML.
- Do not wrap the entire response inside a Markdown code block.
- Do not add unnecessary headings or formatting.
- Do not use Markdown formatting when plain text is more appropriate.
- Prioritize answering the user's question clearly over excessive formatting.

SOURCE CITATION INSTRUCTIONS:

Use citations to support factual claims derived from the retrieved documents.

- Use only the exact source IDs provided in the context, formatted as [SOURCE_X].
- Never invent or modify source IDs.
- Cite meaningful claims or logical groups of related claims, not every sentence.
- When several consecutive claims are supported by the same source, cite the source once at the end of the logical group.
- Avoid repeating the same citation unnecessarily.
- When a claim is supported by multiple sources, include all relevant source IDs.
- Keep citations immediately after the claim they support.
- Do not cite conversation history.
- Do not cite general knowledge unless the answer is specifically based on the retrieved documents.
- Preserve citation accuracy even when reducing citation frequency.

Example:
Vasanth has experience with React.js, Node.js, and MongoDB. [SOURCE_1]

Multiple sources:
Vasanth has experience with React.js and Node.js. [SOURCE_1] [SOURCE_3]

The frontend converts these source IDs into user-facing citation numbers.

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
