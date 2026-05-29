export type MemoryProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Memory {
  id: string;

  userId: string;

  url: string;

  processingStatus: MemoryProcessingStatus;

  createdAt: string;
}