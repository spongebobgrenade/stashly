import type { MemoryUserV1 } from "../types";

export function buildUserLayer(): MemoryUserV1 {
  return {
    notes: [],
    tags: [],
  };
}
