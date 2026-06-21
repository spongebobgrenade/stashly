import {
  getKeywordScore,
  keywordRetrievalStrategy,
} from "./retrieval-strategies";

import {
  semanticRetrievalStrategy,
} from "./semantic-retrieval-strategy";

import { highlightMatch } from "./highlight-match";

import type {
  RetrievalContext,
  RetrievalQuery,
  RetrievalResult,
  SearchMemory,
} from "./retrieval-types";

function normalizeTitle(
  title: string
): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getDuplicateGroupKey(
  memory: SearchMemory
): string {
  const canonicalUrl =
    memory.canonical_url?.trim();

  if (canonicalUrl) {
    return `url:${canonicalUrl}`;
  }

  const fallbackTitle =
    memory.title?.trim() ||
    memory.original_input.trim();

  return `title:${normalizeTitle(fallbackTitle)}`;
}

function collapseDuplicateResults(
  results: RetrievalResult
): RetrievalResult {
  const groupCounts =
    new Map<string, number>();

  for (const memory of results) {
    const key =
      getDuplicateGroupKey(
        memory
      );

    groupCounts.set(
      key,
      (groupCounts.get(key) ?? 0) +
        1
    );
  }

  const collapsedResults:
    RetrievalResult = [];
  const seenGroups =
    new Set<string>();

  for (const memory of results) {
    const key =
      getDuplicateGroupKey(
        memory
      );

    if (seenGroups.has(key)) {
      continue;
    }

    seenGroups.add(key);

    collapsedResults.push({
      ...memory,
      duplicateCount:
        groupCounts.get(key) ?? 1,
    });
  }

  return collapsedResults;
}

function applyHybridThreshold(
  results: RetrievalResult
): RetrievalResult {
  return results.filter(
    (memory) => {
      const keywordScore =
        memory.keywordScore ?? 0;

      if (keywordScore > 0) {
        return true;
      }

      const semanticScore =
        memory.semanticScore ??
        memory.similarity ??
        0;

      return semanticScore >= 0.5;
    }
  );
}
function fuseHybridResults(
  query: string,
  semanticResults: RetrievalResult,
  keywordResults: RetrievalResult
): RetrievalResult {
  const fusedResults =
    new Map<string, SearchMemory>();

  for (const memory of semanticResults) {
    const semanticScore =
      memory.similarity ?? 0;

    fusedResults.set(
      memory.id,
      {
        ...memory,
        semanticScore,
        keywordScore:
          memory.keywordScore ?? 0,
        finalScore:
          semanticScore +
          (memory.keywordScore ?? 0),
      }
    );
  }

  for (const memory of keywordResults) {
    const existing =
      fusedResults.get(memory.id);
    const keywordScore =
      memory.keywordScore ??
      getKeywordScore(
        memory,
        query
      );

    if (!existing) {
      fusedResults.set(
        memory.id,
        {
          ...memory,
          semanticScore:
            memory.semanticScore ?? 0,
          keywordScore,
          finalScore:
            (memory.semanticScore ??
              0) + keywordScore,
        }
      );

      continue;
    }

    const semanticScore =
      existing.semanticScore ??
      existing.similarity ??
      0;

    fusedResults.set(
      memory.id,
      {
        ...existing,
        ...memory,
        similarity:
          existing.similarity ??
          memory.similarity,
        semanticScore,
        keywordScore,
        finalScore:
          semanticScore +
          keywordScore,
      }
    );
  }

  return Array.from(
    fusedResults.values()
  ).sort((a, b) => {
    const scoreDelta =
      (b.finalScore ?? 0) -
      (a.finalScore ?? 0);

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return (
      (b.created_at ?? "")
        .localeCompare(
          a.created_at ?? ""
        )
    );
  });
}

function rankResults(
  results: RetrievalResult
): RetrievalResult {
  return [...results].sort(
    (a, b) => {
      const scoreDelta =
        (b.finalScore ??
          b.semanticScore ??
          b.keywordScore ??
          b.similarity ??
          0) -
        (a.finalScore ??
          a.semanticScore ??
          a.keywordScore ??
          a.similarity ??
          0);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return (
        (b.created_at ?? "")
          .localeCompare(
            a.created_at ?? ""
          )
      );
    }
  );
}

export async function retrieveMemories(
  input: RetrievalQuery,
  context: RetrievalContext
): Promise<RetrievalResult> {
  if (
    !context.userId.trim()
  ) {
    return [];
  }

  const results = await (async () => {
    switch (
      input.mode ??
      "keyword"
    ) {
      case "semantic":
        return collapseDuplicateResults(
          rankResults(
            await semanticRetrievalStrategy(
              input,
              context
            )
          )
        );

      case "hybrid": {
        const [
          semanticResults,
          keywordResults,
        ] = await Promise.all([
          semanticRetrievalStrategy(
            input,
            context
          ),
          keywordRetrievalStrategy(
            input,
            context
          ),
        ]);

        return applyHybridThreshold(
          collapseDuplicateResults(
            fuseHybridResults(
              input.query,
              semanticResults,
              keywordResults
            )
          )
        );
      }

      case "keyword":
      default:
        return collapseDuplicateResults(
          rankResults(
            await keywordRetrievalStrategy(
              input,
              context
            )
          )
        );
    }
  })();

  const query = input.query;
  for (const memory of results) {
    const snippet =
      highlightMatch(memory.title, query) ??
      highlightMatch(memory.description, query) ??
      highlightMatch(memory.original_input, query);

    if (snippet !== null) {
      memory.highlightSnippet = snippet;
    }
  }

  return results;
}
