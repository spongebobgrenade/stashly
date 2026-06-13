import { z } from "zod";

import type {
  MemoryEntityV1,
  MemoryKnowledgeV1,
  MemoryMetadataV1,
  MemoryTopicV1,
  MemoryTranscriptV1,
} from "@/lib/memory-v1/types";

import {
  generateWithOllama,
} from "./ollama";

console.log(
  "🚨 KNOWLEDGE EXTRACTION V2 LOADED"
);

const TOPIC_SCHEMA =
  z.union([
    z.string(),
    z.object({
      name: z.string(),
      type: z.string(),
    }),
  ]);

const ENTITY_SCHEMA =
  z.union([
    z.string(),
    z.object({
      name: z.string(),
      type: z.string(),
    }),
  ]);

const KNOWLEDGE_SCHEMA = z.object({
  topics: z.array(
    TOPIC_SCHEMA
  ),

  entities: z.array(
    ENTITY_SCHEMA
  ),

  keyInsights: z.array(
    z.string()
  ),
});

const EMPTY_KNOWLEDGE: MemoryKnowledgeV1 =
  {
    topics: [],
    entities: [],
    keyInsights: [],
  };

export async function extractMemoryKnowledge(
  input: {
    metadata: MemoryMetadataV1;
    transcript: MemoryTranscriptV1;
  }
): Promise<MemoryKnowledgeV1> {
  const startedAt =
    Date.now();

  const prompt =
    buildKnowledgePrompt(input);

  if (!prompt) {
    console.log(
      "⚠️ Knowledge extraction skipped: empty prompt"
    );

    console.log(
      "⏱️ Knowledge extraction time:",
      Date.now() - startedAt,
      "ms"
    );

    return EMPTY_KNOWLEDGE;
  }

  try {
    const rawOutput =
      await generateWithOllama(
        prompt,
        {
          format: "json",
          numPredict: 600,
          temperature: 0.1,
        }
      );

    console.log(
      "🧠 KNOWLEDGE RAW OUTPUT:"
    );

    console.log(rawOutput);

    let parsedJson: unknown;

    try {
      parsedJson =
        JSON.parse(rawOutput);
    } catch (parseError) {
      console.error(
        "❌ Knowledge JSON parse failed"
      );

      console.error(
        parseError
      );

      console.error(
        "Raw output:"
      );

      console.error(
        rawOutput
      );

      console.log(
        "⏱️ Knowledge extraction time:",
        Date.now() - startedAt,
        "ms"
      );

      return EMPTY_KNOWLEDGE;
    }

    const parsed =
      KNOWLEDGE_SCHEMA.safeParse(
        parsedJson
      );

    if (!parsed.success) {
      console.error(
        "❌ Knowledge schema validation failed"
      );

      console.error(
        parsed.error.flatten()
      );

      console.error(
        "Parsed JSON:"
      );

      console.error(
        parsedJson
      );

      console.log(
        "⏱️ Knowledge extraction time:",
        Date.now() - startedAt,
        "ms"
      );

      return EMPTY_KNOWLEDGE;
    }

    const result: MemoryKnowledgeV1 =
      {
        topics: mergeTopics(
          parsed.data.topics.map(
            normalizeTopic
          )
        ),

        entities: mergeEntities(
          parsed.data.entities.map(
            normalizeEntity
          ),
          seedMetadataEntities(
            input.metadata
          )
        ),

        keyInsights:
          normalizeList(
            parsed.data
              .keyInsights,
            10,
            300
          ),
      };

    console.log(
      "✅ Knowledge extraction result",
      result
    );

    console.log(
      "⏱️ Knowledge extraction time:",
      Date.now() - startedAt,
      "ms"
    );

    return result;
  } catch (error) {
    console.error(
      "❌ Knowledge extraction failed:"
    );

    console.error(error);

    console.log(
      "⏱️ Knowledge extraction time:",
      Date.now() - startedAt,
      "ms"
    );

    return EMPTY_KNOWLEDGE;
  }
}

function buildKnowledgePrompt(
  input: {
    metadata: MemoryMetadataV1;
    transcript: MemoryTranscriptV1;
  }
): string {
  const transcriptSample =
    input.transcript.chunks
      .slice(0, 6)
      .join("\n\n")
      .slice(0, 5000)
      .trim();

  const metadataLines = [
    `Title: ${input.metadata.title ?? ""}`,
    `Creator: ${input.metadata.creatorName ?? ""}`,
    `Source Platform: ${input.metadata.sourcePlatform ?? ""}`,
    `Content Type: ${input.metadata.contentType ?? ""}`,
  ]
    .filter(
      (line) =>
        !line.endsWith(": ")
    )
    .join("\n");

  if (
    !metadataLines &&
    !transcriptSample
  ) {
    return "";
  }

  return [
    "You are extracting retrieval-oriented knowledge from a saved memory.",
    "",
    "Return STRICT JSON only.",
    "",
    `{
      "topics":[
        {
          "name":"",
          "type":""
        }
      ],
      "entities":[
        {
          "name":"",
          "type":""
        }
      ],
      "keyInsights":[""]
    }`,
    "",
    "TOPICS",
    "- extract 3 to 12 topics",
    "- use specific retrieval-friendly topics",
    '- format: {"name":"topic","type":"category"}',
    "",
    "ENTITIES",
    "- extract all named things",
    "- people",
    "- companies",
    "- products",
    "- software",
    "- frameworks",
    "- repositories",
    "- books",
    "- websites",
    "- organizations",
    "- brands",
    "- creators",
    "",
    'Entity format: {"name":"React","type":"software"}',
    "",
    "KEY INSIGHTS",
    "- factual takeaways",
    "- retrieval friendly",
    "- concrete",
    "",
    "Return JSON only.",
    "",
    "Metadata:",
    metadataLines || "None",
    "",
    "Transcript:",
    transcriptSample || "None",
  ].join("\n");
}

function normalizeTopic(
  topic:
    | string
    | MemoryTopicV1
): MemoryTopicV1 {
  if (
    typeof topic ===
    "string"
  ) {
    return {
      name: topic,
      type: "general",
    };
  }

  return {
    name:
      topic.name.trim(),
    type:
      topic.type.trim() ||
      "general",
  };
}

function normalizeEntity(
  entity:
    | string
    | MemoryEntityV1
): MemoryEntityV1 {
  if (
    typeof entity ===
    "string"
  ) {
    return {
      name: entity,
      type: "unknown",
    };
  }

  return {
    name:
      entity.name.trim(),
    type:
      entity.type.trim() ||
      "unknown",
  };
}

function normalizeList(
  values: string[],
  limit: number,
  maxLength: number
): string[] {
  const seen =
    new Set<string>();

  const normalized: string[] =
    [];

  for (const value of values) {
    const cleaned = value
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);

    const key =
      cleaned.toLowerCase();

    if (
      !cleaned ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    normalized.push(cleaned);

    if (
      normalized.length >=
      limit
    ) {
      break;
    }
  }

  return normalized;
}

function seedMetadataEntities(
  metadata: MemoryMetadataV1
): MemoryEntityV1[] {
  const entities:
    MemoryEntityV1[] = [];

  if (
    metadata.creatorName
  ) {
    entities.push({
      name:
        metadata.creatorName,
      type: "creator",
    });
  }

  return entities;
}

function mergeTopics(
  topics:
    MemoryTopicV1[]
): MemoryTopicV1[] {
  const seen =
    new Set<string>();

  const merged:
    MemoryTopicV1[] = [];

  for (const topic of topics) {
    const name =
      topic.name
        .replace(/\s+/g, " ")
        .trim();

    if (!name) {
      continue;
    }

    const key =
      name.toLowerCase();

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    merged.push({
      name,
      type:
        topic.type ||
        "general",
    });
  }

  return merged.slice(
    0,
    25
  );
}

function mergeEntities(
  llmEntities:
    MemoryEntityV1[],
  metadataEntities:
    MemoryEntityV1[]
): MemoryEntityV1[] {
  const seen =
    new Set<string>();

  const merged:
    MemoryEntityV1[] = [];

  for (const entity of [
    ...metadataEntities,
    ...llmEntities,
  ]) {
    const name =
      entity.name
        .replace(/\s+/g, " ")
        .trim();

    if (!name) {
      continue;
    }

    const key =
      name.toLowerCase();

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    merged.push({
      name,
      type:
        entity.type ||
        "unknown",
    });
  }

  return merged.slice(
    0,
    25
  );
}