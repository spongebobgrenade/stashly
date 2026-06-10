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
  MemoryKnowledgeV1,
  Save,
} from "./types";

type MemoryComposerHooks = {
  onKnowledgeExtractionStarted?: () => void;
  onKnowledgeExtractionCompleted?: (
    knowledge: MemoryKnowledgeV1
  ) => void;
  onSummaryGenerationCompleted?: (
    summary: string
  ) => void;
};

export async function composeMemoryV1(
  save: Save,
  hooks: MemoryComposerHooks = {}
): Promise<MemoryV1> {
  const metadata =
    buildMetadataLayer(save);

  const transcript =
    buildTranscriptLayer(save);

  const visual =
    buildVisualLayer();

  hooks.onKnowledgeExtractionStarted?.();

  const knowledge =
    await buildKnowledgeLayer({
      metadata,
      transcript,
    });

  hooks.onKnowledgeExtractionCompleted?.(
    knowledge
  );

  const user =
    buildUserLayer();

  const createdAt =
    save.created_at ??
    new Date().toISOString();

  const updatedAt =
    save.updated_at ??
    createdAt;

  const retrieval =
    await buildRetrievalLayer({
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

  hooks.onSummaryGenerationCompleted?.(
    retrieval.summary
  );

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
