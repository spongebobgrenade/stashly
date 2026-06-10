import type { MemoryKnowledgeV1 } from "../types";

export function buildKnowledgeLayer(): MemoryKnowledgeV1 {
  return {
    topics: [],
    entities: [],
    keyInsights: [],
  };
}
