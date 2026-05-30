import { useMemoryStore } from "@/lib/memories/store";

import type { Memory } from "@/types/memory";

let started = false;

let intervalId:
  | ReturnType<typeof setInterval>
  | null = null;

const RECONCILIATION_INTERVAL =
  15_000;

export function startMemoryReconciliation() {
  if (started) {
    return;
  }

  started = true;

  intervalId = setInterval(
    async () => {
      try {
        const response =
          await fetch(
            "/api/memories/pending"
          );

        if (!response.ok) {
          return;
        }

        const memories =
          (await response.json()) as Memory[];

        const upsertMemory =
          useMemoryStore.getState()
            .upsertMemory;

        for (const memory of memories) {
          upsertMemory(memory);
        }
      } catch (error) {
        console.error(
          "Memory reconciliation failed:",
          error
        );
      }
    },
    RECONCILIATION_INTERVAL
  );
}

export function stopMemoryReconciliation() {
  if (intervalId) {
    clearInterval(intervalId);

    intervalId = null;
  }

  started = false;
}