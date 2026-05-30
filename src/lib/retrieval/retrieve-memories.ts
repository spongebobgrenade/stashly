import {
  keywordRetrievalStrategy,
} from "./retrieval-strategies";

import type {
  RetrievalQuery,
  RetrievalResult,
} from "./retrieval-types";

export async function retrieveMemories(
  input: RetrievalQuery
): Promise<RetrievalResult> {
  return keywordRetrievalStrategy(
    input
  );
}