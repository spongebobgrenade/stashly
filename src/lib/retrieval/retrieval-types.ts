import type { Memory } from "@/types/memory";

export type RetrievalMode =
  | "keyword"
  | "semantic"
  | "hybrid";

export type RetrievalContext = {
  userId: string;
};

export type RetrievalQuery = {
  query: string;
  mode?: RetrievalMode;
};

export type SearchMemory =
  Pick<
    Memory,
    | "id"
    | "user_id"
    | "content_type"
    | "original_input"
    | "source_platform"
    | "title"
    | "description"
    | "thumbnail_url"
    | "creator_name"
    | "canonical_url"
    | "processing_status"
    | "created_at"
    | "updated_at"
  > & {
    similarity?: number;
    semanticScore?: number;
    keywordScore?: number;
    finalScore?: number;
    duplicateCount?: number;
    highlightSnippet?: string;
  };

export type RetrievalResult =
  SearchMemory[];

export type SemanticMatch = {
  memory_id: string;
  similarity: number;
};

export type SearchEvaluationResult = {
  query: string;
  results_count: number;
  title: string;
  similarity: number | null;
  semanticScore: number | null;
  keywordScore: number | null;
  finalScore: number | null;
  duplicateCount: number | null;
};
