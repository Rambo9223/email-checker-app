// Extracts all unique URLs from a combined text/HTML blob.
const URL_REGEX = /https?:\/\/[^\s"'<>)\]]+/gi;

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX) ?? [];
  // Deduplicate and strip trailing punctuation artefacts
  return [...new Set(matches.map((u) => u.replace(/[.,;!?)]+$/, "")))];
}
