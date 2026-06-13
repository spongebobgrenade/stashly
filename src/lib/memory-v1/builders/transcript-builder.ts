import type { Json } from "@/types/database.types";

import type {
  MemoryTranscriptV1,
  Save,
} from "../types";

const CONTENT_KEYS = [
  "transcript",
  "caption",
  "articleText",
  "documentText",
  "ocrText",
  "article_text",
  "document_text",
  "ocr_text",
  "content",
  "text",
  "body",
  "description",
] as const;

const CHUNK_SIZE = 4000;

export function buildTranscriptLayer(
  save: Save
): MemoryTranscriptV1 {
  const textSources =
    collectTextSources(
      save.raw_metadata
    );

  if (save.description) {
    textSources.push(
      save.description
    );
  }

  const deduplicated =
    deduplicateText(
      textSources
    );

  const rawText =
    normalizeText(
      deduplicated.join(
        "\n\n"
      )
    );

  const chunks =
    buildChunks(rawText);

  console.log(
    "📄 Transcript stats",
    {
      textSources:
        textSources.length,

      deduplicatedSources:
        deduplicated.length,

      rawTextLength:
        rawText.length,

      chunks:
        chunks.length,
    }
  );

  return {
    rawText,
    chunks,
  };
}

function collectTextSources(
  value: Json | null
): string[] {
  const results: string[] =
    [];

  collectStructuredFields(
    value,
    results
  );

  return results;
}

function collectStructuredFields(
  value: Json | null,
  results: string[]
): void {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return;
  }

  if (
    Array.isArray(value)
  ) {
    for (const item of value) {
      collectStructuredFields(
        item,
        results
      );
    }

    return;
  }

  for (const key of CONTENT_KEYS) {
    const candidate =
      value[key];

    if (
      typeof candidate ===
      "string"
    ) {
      const normalized =
        normalizeText(
          candidate
        );

      if (
        normalized.length >
        50
      ) {
        results.push(
          normalized
        );
      }
    }
  }

  for (const nestedValue of Object.values(
    value
  )) {
    if (
      nestedValue &&
      typeof nestedValue ===
        "object"
    ) {
      collectStructuredFields(
        nestedValue as Json,
        results
      );
    }
  }
}

function deduplicateText(
  values: string[]
): string[] {
  const seen =
    new Set<string>();

  const output: string[] =
    [];

  for (const value of values) {
    const cleaned =
      normalizeText(
        value
      );

    if (
      cleaned.length < 50
    ) {
      continue;
    }

    const key =
      cleaned.toLowerCase();

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    output.push(cleaned);
  }

  return output;
}

function buildChunks(
  rawText: string
): string[] {
  if (!rawText) {
    return [];
  }

  return splitLongText(
    rawText
  );
}

function splitLongText(
  value: string
): string[] {
  if (!value) {
    return [];
  }

  const chunks: string[] =
    [];

  for (
    let index = 0;
    index < value.length;
    index += CHUNK_SIZE
  ) {
    const chunk =
      normalizeText(
        value.slice(
          index,
          index +
            CHUNK_SIZE
        )
      );

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function normalizeText(
  value:
    | string
    | null
    | undefined
): string {
  return (
    value ?? ""
  )
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}