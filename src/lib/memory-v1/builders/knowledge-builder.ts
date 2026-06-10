import {
  extractMemoryKnowledge,
} from "@/services/memory-intelligence/knowledge-extraction";

import type {
  MemoryKnowledgeV1,
  MemoryMetadataV1,
  MemoryTranscriptV1,
} from "../types";

export async function buildKnowledgeLayer(
  input: {
    metadata: MemoryMetadataV1;
    transcript: MemoryTranscriptV1;
  }
): Promise<MemoryKnowledgeV1> {
  return extractMemoryKnowledge(
    input
  );
}
