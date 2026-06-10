import type { Json } from "@/types/database.types";

import type {
  MemoryTranscriptV1,
  Save,
} from "../types";

const CONTENT_KEYS = [
  "transcript",
  "caption",
  "article_text",
  "document_text",
  "content",
  "text",
  "body",
  "description",
] as const;

const CHUNK_SIZE = 1000;

export function buildTranscriptLayer(
  save: Save
): MemoryTranscriptV1 {
  const rawText = normalizeText(
    findTextInMetadata(
      save.raw_metadata
    ) ?? save.description
  );

  return {
    rawText,
    chunks: buildChunks(rawText),
  };
}

function findTextInMetadata(
  value: Json | null
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return null;
  }

  if (typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const text =
        findTextInMetadata(item);

      if (text) {
        return text;
      }
    }

    return null;
  }

  for (const key of CONTENT_KEYS) {
    const candidate =
      value[key];

    if (
      typeof candidate ===
      "string"
    ) {
      const normalized =
        normalizeText(candidate);

      if (normalized) {
        return normalized;
      }
    }
  }

  for (const nestedValue of Object.values(
    value
  )) {
    const text =
      findTextInMetadata(
        nestedValue ?? null
      );

    if (text) {
      return text;
    }
  }

  return null;
}

function buildChunks(
  rawText: string
): string[] {
  if (!rawText) {
    return [];
  }

  const paragraphs =
    rawText
      .split(/\n\s*\n/g)
      .map(normalizeText)
      .filter(Boolean);

  if (paragraphs.length === 0) {
    return splitLongText(rawText);
  }

  return paragraphs.flatMap(
    splitLongText
  );
}

function splitLongText(
  value: string
): string[] {
  if (!value) {
    return [];
  }

  const chunks: string[] = [];

  for (
    let index = 0;
    index < value.length;
    index += CHUNK_SIZE
  ) {
    const chunk = normalizeText(
      value.slice(
        index,
        index + CHUNK_SIZE
      )
    );

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function normalizeText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
