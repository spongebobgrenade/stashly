import type { Tables } from "@/types/database.types";

export type Memory = Tables<"saves">;

export type MemoryProcessingStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";