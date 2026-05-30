import type { Memory } from "@/types/memory";

export function buildRetrievalDocument(
  memory: Memory
): string {
  return [
    memory.title,
    memory.description,
    memory.creator_name,
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}