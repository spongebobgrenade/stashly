import type {
  MemoryV1,
  RetrievalDocumentV1,
} from "./types";

export function buildRetrievalDocumentV1(
  memory: MemoryV1
): RetrievalDocumentV1 {
  return {
    title: memory.metadata.title,
    summary:
      memory.retrieval.summary,
    topics: [
      ...memory.knowledge.topics,
    ],
    entities: [
      ...memory.knowledge.entities,
    ],
    keyInsights: [
      ...memory.knowledge.keyInsights,
    ],
    creatorName:
      memory.metadata.creatorName,
    userNotes: [
      ...memory.user.notes,
    ],
  };
}
