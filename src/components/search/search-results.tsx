import { MemoryCard } from "@/components/memory-card";

interface SearchResultsProps {
  memories: any[];
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