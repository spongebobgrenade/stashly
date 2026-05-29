import { create } from "zustand";

export type Memory = {
  id: string;
  url?: string | null;
  original_input?: string | null;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  source_platform: string | null;
  creator_name: string | null;
  processing_status: string | null;
  created_at?: string;
};

type MemoryStore = {
  memories: Memory[];
  initializeMemories: (memories: Memory[]) => void;
  addOptimisticMemory: (url: string) => void;
  upsertMemory: (memory: Memory) => void;
};

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: [],

  initializeMemories: (memories) => {
    if (get().memories.length > 0) {
      return;
    }
    set({ memories });
  },

  addOptimisticMemory: (url) => {
    const optimisticMemory: Memory = {
      id: `optimistic-${Date.now()}`,
      url,
      title: "Saving memory...",
      description: "Preparing metadata enrichment...",
      thumbnail_url: null,
      source_platform: "Pending",
      creator_name: null,
      processing_status: "queued",
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      memories: [optimisticMemory, ...state.memories],
    }));
  },

  upsertMemory: (memory) => {
    set((state) => {
      const incomingUrl = (memory.original_input || memory.url || "")
        .trim()
        .replace(/\/$/, "");

      // Remove matching optimistic entry (normalize URLs on both sides)
      const filtered = state.memories.filter((existingMemory) => {
        if (!existingMemory.id.startsWith("optimistic-")) return true;

        const existingUrl = (
          existingMemory.url ||
          existingMemory.original_input ||
          ""
        )
          .trim()
          .replace(/\/$/, "");

        // Remove optimistic entry only if URLs match
        return existingUrl !== incomingUrl;
      });

      // Check if real record already exists in the list
      const existsIndex = filtered.findIndex(
        (existingMemory) => existingMemory.id === memory.id
      );

      if (existsIndex !== -1) {
        // Update in place, preserving any fields not in the incoming payload
        const updated = [...filtered];
        updated[existsIndex] = { ...filtered[existsIndex], ...memory };
        return { memories: updated };
      }

      // New real record — prepend to list
      return {
        memories: [memory, ...filtered],
      };
    });
  },
}));