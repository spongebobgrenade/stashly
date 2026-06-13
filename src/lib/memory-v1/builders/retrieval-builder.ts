import {
  buildRetrievalDocumentV1,
} from "../retrieval-document";

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
  const parts: string[] =
    [];

  if (
    memory.metadata.title
  ) {
    parts.push(
      memory.metadata.title
    );
  }

  if (
    memory.knowledge.keyInsights
      .length > 0
  ) {
    parts.push(
      memory.knowledge
        .keyInsights[0]
    );
  }

  if (
    memory.knowledge.topics
      .length > 0
  ) {
    const topicNames =
      memory.knowledge.topics
        .slice(0, 3)
        .map((topic) =>
          typeof topic ===
          "string"
            ? topic
            : topic.name
        );

    parts.push(
      `Topics: ${topicNames.join(", ")}`
    );
  }

  return parts
    .join(". ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}