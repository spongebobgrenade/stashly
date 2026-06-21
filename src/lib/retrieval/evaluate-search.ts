import {
  retrieveMemories,
} from "./retrieve-memories";

import type {
  RetrievalContext,
  RetrievalMode,
  SearchEvaluationResult,
} from "./retrieval-types";

export async function evaluateSearchQueries(
  queries: readonly string[],
  context: RetrievalContext,
  mode: RetrievalMode = "hybrid"
): Promise<SearchEvaluationResult[]> {
  const results: SearchEvaluationResult[] =
    [];

  for (const query of queries) {
    const memories =
      await retrieveMemories(
        {
          query,
          mode,
        },
        context
      );

    const topResults =
      memories.slice(0, 5);

    if (
      topResults.length === 0
    ) {
      results.push({
        query,
        results_count: 0,
        title: "",
        similarity: null,
        semanticScore: null,
        keywordScore: null,
        finalScore: null,
        duplicateCount: null,
      });

      continue;
    }

    for (const [
      index,
      memory,
    ] of topResults.entries()) {
      const trimmedTitle =
        memory.title?.trim();

      const title =
        trimmedTitle ||
        memory.original_input.trim() ||
        `Untitled result ${index + 1}`;

      results.push({
        query,
        results_count:
          memories.length,
        title,
        similarity:
          memory.similarity ??
          null,
        semanticScore:
          memory.semanticScore ??
          null,
        keywordScore:
          memory.keywordScore ??
          null,
        finalScore:
          memory.finalScore ??
          null,
        duplicateCount:
          memory.duplicateCount ??
          null,
      });
    }
  }

  return results;
}
