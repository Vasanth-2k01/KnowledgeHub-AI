export function cleanChunkText(raw: string): string {
  if (!raw) return "";

  // 1. Fix hyphenated line-break artifacts (e.g., "infor-\nmation" -> "information")
  let cleaned = raw.replace(/([a-zA-Z])-\n([a-zA-Z])/g, "$1$2");

  // 2. Join lines that do not end with sentence-ending punctuation (., ?, !, :)
  // We use a regex that looks for a line ending with a non-punctuation char, 
  // followed by a newline, followed by a non-whitespace character.
  // This reflows dense PDF columns.
  cleaned = cleaned.replace(/([^.?!:\n\r])\s*\n\s*([^\s])/g, "$1 $2");

  // 3. Re-insert a blank line between apparent paragraph boundaries 
  // (line ending with . followed by a line starting with a capital letter)
  // This helps restore lost paragraphs.
  cleaned = cleaned.replace(/([.?!:])\s*\n\s*([A-Z])/g, "$1\n\n$2");

  // 4. Collapse multiple spaces/tabs within a line into a single space
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // 5. Collapse 3+ consecutive newlines -> max 2 (paragraph break)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}
