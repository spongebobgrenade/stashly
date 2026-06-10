import {
  buildRetrievalDocumentV1,
} from "../retrieval-document";

import type {
  MemoryRetrievalV1,
  MemoryV1,
} from "../types";

const SUMMARY_LIMIT = 280;

export function buildRetrievalLayer(
  memory: Omit<
    MemoryV1,
    "retrieval"
  >
): MemoryRetrievalV1 {
  const summary =
    buildDeterministicSummary(
      memory
    );

  const memoryWithSummary: MemoryV1 =
    {
      ...memory,
      retrieval: {
        summary,
        retrievalDocument: {
          title: null,
          summary: "",
          topics: [],
          entities: [],
          keyInsights: [],
          creatorName: null,
          userNotes: [],
        },
      },
    };

  const retrievalDocument =
    buildRetrievalDocumentV1(
      memoryWithSummary
    );

  return {
    summary,
    retrievalDocument,
  };
}

function buildDeterministicSummary(
  memory: Omit<
    MemoryV1,
    "retrieval"
  >
): string {
  const sourceText =
    memory.transcript.rawText ||
    memory.metadata.title ||
    "";

  if (!sourceText) {
    return "";
  }

  const firstSentence =
    sourceText.match(
      /^(.{1,280}?[.!?])(\s|$)/
    )?.[1] ?? sourceText;

  return firstSentence
    .slice(0, SUMMARY_LIMIT)
    .trim();
}
