import {
  buildRetrievalDocumentV1,
} from "../retrieval-document";

import {
  generateMemorySummary,
} from "@/services/memory-intelligence/summary";

import type {
  MemoryRetrievalV1,
  MemoryV1,
} from "../types";

export async function buildRetrievalLayer(
  memory: Omit<
    MemoryV1,
    "retrieval"
  >
): Promise<MemoryRetrievalV1> {
  const summary =
    await generateMemorySummary(
      {
        metadata:
          memory.metadata,
        transcript:
          memory.transcript,
        knowledge:
          memory.knowledge,
      }
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
