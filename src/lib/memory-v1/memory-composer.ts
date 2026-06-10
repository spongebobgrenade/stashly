import {
  buildKnowledgeLayer,
} from "./builders/knowledge-builder";
import {
  buildMetadataLayer,
} from "./builders/metadata-builder";
import {
  buildRetrievalLayer,
} from "./builders/retrieval-builder";
import {
  buildTranscriptLayer,
} from "./builders/transcript-builder";
import {
  buildUserLayer,
} from "./builders/user-builder";
import {
  buildVisualLayer,
} from "./builders/visual-builder";

import type {
  MemoryV1,
  Save,
} from "./types";

export function composeMemoryV1(
  save: Save
): MemoryV1 {
  const metadata =
    buildMetadataLayer(save);

  const transcript =
    buildTranscriptLayer(save);

  const visual =
    buildVisualLayer();

  const knowledge =
    buildKnowledgeLayer();

  const user =
    buildUserLayer();

  const createdAt =
    save.created_at ??
    new Date().toISOString();

  const updatedAt =
    save.updated_at ??
    createdAt;

  const retrieval =
    buildRetrievalLayer({
      memoryId: save.id,
      version: "1.0",
      createdAt,
      updatedAt,
      metadata,
      transcript,
      visual,
      knowledge,
      user,
    });

  return {
    memoryId: save.id,

    version: "1.0",

    createdAt,

    updatedAt,

    metadata,
    transcript,
    visual,
    knowledge,
    user,
    retrieval,
  };
}