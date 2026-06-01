import {
  keywordRetrievalStrategy,
} from "./retrieval-strategies";

import {
  semanticRetrievalStrategy,
} from "./semantic-retrieval-strategy";

import type {
  RetrievalQuery,
  RetrievalResult,
} from "./retrieval-types";

export async function retrieveMemories(
  input: RetrievalQuery
): Promise<RetrievalResult> {
  switch (
    input.mode ??
    "keyword"
  ) {
    case "semantic":
      return semanticRetrievalStrategy(
        input
      );

    case "hybrid":
      return semanticRetrievalStrategy(
        input
      );

    case "keyword":
    default:
      return keywordRetrievalStrategy(
        input
      );
  }
}
