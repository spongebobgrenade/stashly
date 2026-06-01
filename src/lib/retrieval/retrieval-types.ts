import type { Memory } from "@/types/memory";

export type RetrievalMode =
  | "keyword"
  | "semantic"
  | "hybrid";

export type RetrievalQuery = {
  query: string;
  mode?: RetrievalMode;
};

export type RetrievalResult = Memory[];

export type SemanticMatch = {
  memory_id: string;
  similarity: number;
};
