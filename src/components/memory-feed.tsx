"use client";

import { useEffect } from "react";

import { MemoryCard } from "@/components/memory-card";

import {
  initializeMemoryRealtime,
  teardownMemoryRealtime,
} from "@/lib/realtime/memory-realtime";

import {
  startMemoryReconciliation,
} from "@/lib/memories/reconciliation";

import {
  useMemoryStore,
} from "@/lib/memories/store";

type MemoryFeedProps = {
  initialMemories: any[];
};

export function MemoryFeed({
  initialMemories,
}: MemoryFeedProps) {
  const memories = useMemoryStore(
    (state) => state.memories
  );

  const initializeMemories =
    useMemoryStore(
      (state) =>
        state.initializeMemories
    );

  useEffect(() => {
    console.log(
      "BOOTSTRAPPING MEMORY SYSTEM"
    );

    initializeMemories(
      initialMemories
    );

    initializeMemoryRealtime();

    startMemoryReconciliation();

    return () => {
      teardownMemoryRealtime();
    };
  }, []);

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