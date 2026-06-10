import type { MemoryVisualV1 } from "../types";

export function buildVisualLayer(): MemoryVisualV1 {
  return {
    ocrText: "",
    imageDescriptions: [],
  };
}
