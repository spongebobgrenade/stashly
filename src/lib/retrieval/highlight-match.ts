/**
 * Finds the first occurrence of a query in the text (case-insensitive)
 * and returns a snippet of approximately 120 characters around the match.
 * Returns null if the query is empty or not found in the text.
 */
export function highlightMatch(
  text: string | null | undefined,
  query: string | null | undefined
): string | null {
  if (!text || !query || query.trim() === "") {
    return null;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) {
    return null;
  }

  const windowLength = 120;
  if (text.length <= windowLength) {
    return text;
  }

  const queryLength = lowerQuery.length;
  const matchMiddle = idx + queryLength / 2;
  let start = Math.floor(matchMiddle - windowLength / 2);

  if (start < 0) {
    start = 0;
  } else if (start + windowLength > text.length) {
    start = text.length - windowLength;
  }

  return text.slice(start, start + windowLength);
}
