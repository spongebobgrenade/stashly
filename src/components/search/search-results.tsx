import { MemoryCard } from "@/components/memory-card";

import type { Memory } from "@/types/memory";

interface SearchResultsProps {
  memories: Memory[];
}

export function SearchResults({
  memories,
}: SearchResultsProps) {
  return (
    <div className="space-y-4">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
        />
      ))}
    </div>
  );
}