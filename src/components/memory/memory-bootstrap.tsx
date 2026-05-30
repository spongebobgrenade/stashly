"use client";

import { useEffect } from "react";

import {
  initializeMemoryRealtime,
  teardownMemoryRealtime,
} from "@/lib/realtime/memory-realtime";

import {
  startMemoryReconciliation,
  stopMemoryReconciliation,
} from "@/lib/memories/reconciliation";

import {
  useMemoryStore,
} from "@/lib/memories/store";

import type { Memory } from "@/types/memory";

type MemoryBootstrapProps = {
  initialMemories: Memory[];
};

export function MemoryBootstrap({
  initialMemories,
}: MemoryBootstrapProps) {
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

      stopMemoryReconciliation();
    };
  }, [
    initialMemories,
    initializeMemories,
  ]);

  return null;
}