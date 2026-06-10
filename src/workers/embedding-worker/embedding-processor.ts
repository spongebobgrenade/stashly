import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { renderRetrievalDocument } from "@/lib/memory-v1/retrieval-renderer";

import {
  generateEmbedding,
} from "@/services/embeddings/gateway";

import {
  getMemoryRepresentation,
} from "@/services/memory-representation";

import type {
  ProcessEmbeddingJob,
} from "@/types/jobs";

export async function processEmbeddingJob(
  jobData: ProcessEmbeddingJob
) {
  const startedAt =
    Date.now();

  const { memoryId } =
    jobData;

  const supabase =
    getSupabaseAdmin();

  try {
    console.log(
      "🧠 Generating embedding..."
    );

    const memoryV1 = await getMemoryRepresentation(
      memoryId
    );

    if (!memoryV1) {
      throw new Error(
        "Memory representation not found"
      );
    }

    const retrievalDocument = renderRetrievalDocument(
      memoryV1.retrieval.retrievalDocument
    );

    if (!retrievalDocument) {
      console.log(
        "⚠️ Empty retrieval document. Skipping embedding."
      );

      return;
    }

    const embeddingResult =
      await generateEmbedding(
        retrievalDocument
      );

    const {
      data: insertedRows,
      error: insertError,
    } = await supabase
      .from(
        "memory_embeddings"
      )
      .insert({
        memory_id: memoryId,

        chunk_index: 0,

        chunk_text:
          retrievalDocument,

        embedding:
          embeddingResult.vector as never,

        provider:
          embeddingResult.provider,

        model:
          embeddingResult.model,
      })
      .select();

    if (insertError) {
      console.error(
        "❌ Failed to store embedding:",
        insertError
      );

      throw insertError;
    }

    console.log(
      "✅ Embedding stored"
    );

    console.log(
      "📦 Stored rows:",
      insertedRows?.length ?? 0
    );

    console.log(
      "⏱️ Embedding time:",
      Date.now() -
        startedAt,
      "ms"
    );
  } catch (error) {
    console.error(
      "❌ Embedding generation failed",
      error
    );

    throw error;
  }
}
