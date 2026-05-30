import type { Memory } from "@/types/memory";

export type RetrievalQuery = {
  query: string;
};

export type RetrievalResult = Memory[];