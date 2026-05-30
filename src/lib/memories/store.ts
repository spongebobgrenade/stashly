import { create } from "zustand";

import type { Memory } from "@/types/memory";

type OptimisticMemory = Memory & {
  url?: string | null;
};

type MemoryStore = {
  memories: OptimisticMemory[];

  initializeMemories: (
    memories: Memory[]
  ) => void;

  addOptimisticMemory: (
    url: string
  ) => void;

  upsertMemory: (
    memory: Memory
  ) => void;
};

export const useMemoryStore =
  create<MemoryStore>(
    (set, get) => ({
      memories: [],

      initializeMemories: (
        memories
      ) => {
        if (
          get().memories.length > 0
        ) {
          return;
        }

        set({
          memories,
        });
      },

      addOptimisticMemory: (
        url
      ) => {
        const optimisticMemory: OptimisticMemory =
          {
            id: `optimistic-${Date.now()}`,

            user_id: "",

            original_input: url,

            content_type:
              "link",

            source_platform:
              "pending",

            canonical_url:
              null,

            title:
              "Saving memory...",

            description:
              "Preparing metadata enrichment...",

            thumbnail_url:
              null,

            creator_name:
              null,

            raw_metadata:
              null,

            processing_status:
              "queued",

            created_at:
              new Date().toISOString(),

            updated_at:
              new Date().toISOString(),

            url,
          };

        set((state) => ({
          memories: [
            optimisticMemory,
            ...state.memories,
          ],
        }));
      },

      upsertMemory: (
        memory
      ) => {
        set((state) => {
          const incomingUrl =
            (
              memory.original_input ??
              ""
            )
              .trim()
              .replace(
                /\/$/,
                ""
              );

          const filtered =
            state.memories.filter(
              (
                existingMemory
              ) => {
                if (
                  !existingMemory.id.startsWith(
                    "optimistic-"
                  )
                ) {
                  return true;
                }

                const existingUrl =
                  (
                    existingMemory.url ??
                    existingMemory.original_input ??
                    ""
                  )
                    .trim()
                    .replace(
                      /\/$/,
                      ""
                    );

                return (
                  existingUrl !==
                  incomingUrl
                );
              }
            );

          const existingIndex =
            filtered.findIndex(
              (
                existingMemory
              ) =>
                existingMemory.id ===
                memory.id
            );

          if (
            existingIndex !== -1
          ) {
            const updated = [
              ...filtered,
            ];

            updated[
              existingIndex
            ] = {
              ...filtered[
                existingIndex
              ],
              ...memory,
            };

            return {
              memories:
                updated,
            };
          }

          return {
            memories: [
              memory,
              ...filtered,
            ],
          };
        });
      },
    })
  );