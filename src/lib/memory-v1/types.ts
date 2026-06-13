import type { Memory as SaveRecord } from "@/types/memory";

export type Save = SaveRecord;

export type MemoryMetadataV1 = {
  title: string | null;
  creatorName: string | null;
  sourcePlatform: string | null;
  canonicalUrl: string | null;
  thumbnailUrl: string | null;
  contentType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MemoryTranscriptV1 = {
  rawText: string;
  chunks: string[];
};

export type MemoryVisualV1 = {
  ocrText: string;
  imageDescriptions: string[];
};

export type MemoryEntityV1 = {
  name: string;
  type: string;
};

export type MemoryTopicV1 = {
  name: string;
  type: string;
};

export type MemoryKnowledgeV1 = {
  topics: MemoryTopicV1[];
  entities: MemoryEntityV1[];
  keyInsights: string[];
};

export type MemoryUserV1 = {
  notes: string[];
  tags: string[];
};

export type RetrievalDocumentV1 = {
  title: string | null;
  summary: string;

  topics: MemoryTopicV1[];

  entities: MemoryEntityV1[];

  keyInsights: string[];

  creatorName: string | null;

  userNotes: string[];
};

export type MemoryRetrievalV1 = {
  summary: string;
  retrievalDocument: RetrievalDocumentV1;
};

export type MemoryV1 = {
  memoryId: string;

  version: "1.0";

  createdAt: string;
  updatedAt: string;

  metadata: MemoryMetadataV1;

  transcript: MemoryTranscriptV1;

  visual: MemoryVisualV1;

  knowledge: MemoryKnowledgeV1;

  user: MemoryUserV1;

  retrieval: MemoryRetrievalV1;
};