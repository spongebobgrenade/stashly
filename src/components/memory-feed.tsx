"use client";

import { MemoryCard } from "@/components/memory-card";

import {
  useMemoryStore,
} from "@/lib/memories/store";

export function MemoryFeed() {
  const memories =
    useMemoryStore(
      (state) => state.memories
    );

  if (memories.length === 0) {
    return (
      <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
        No memories saved yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
        />
      ))}
    </div>
  );
}