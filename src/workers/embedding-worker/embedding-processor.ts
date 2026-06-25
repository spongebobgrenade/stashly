import { getSupabaseAdmin } from "@/lib/supabase/admin";

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
  const startedAt = Date.now();

  const { memoryId } = jobData;

  const supabase =
    getSupabaseAdmin();

  try {
    console.log(
      "🧠 Generating chunk embeddings..."
    );

    const memoryV1 =
      await getMemoryRepresentation(
        memoryId
      );

    if (!memoryV1) {
      throw new Error(
        "Memory representation not found"
      );
    }

    const chunks =
      memoryV1.transcript.chunks;

    if (
      !chunks ||
      chunks.length === 0
    ) {
      console.log(
        "⚠️ No transcript chunks found. Skipping embedding."
      );

      return;
    }

    const {
      error: deleteError,
    } = await supabase
      .from("memory_embeddings")
      .delete()
      .eq(
        "memory_id",
        memoryId
      );

    if (deleteError) {
      throw deleteError;
    }

    console.log(
      `📄 Embedding ${chunks.length} chunks`
    );

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      const chunk =
        chunks[i];

      if (
        !chunk ||
        !chunk.trim()
      ) {
        continue;
      }

      const embeddingResult =
        await generateEmbedding(
          chunk
        );

      const {
        error: insertError,
      } = await supabase
        .from(
          "memory_embeddings"
        )
        .insert({
          memory_id:
            memoryId,

          chunk_index: i,

          chunk_text:
            chunk,

          embedding:
            embeddingResult.vector as never,

          provider:
            embeddingResult.provider,

          model:
            embeddingResult.model,
        });

      if (insertError) {
        throw insertError;
      }
    }

    const {
      count,
      error: verifyError,
    } = await supabase
      .from(
        "memory_embeddings"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "memory_id",
        memoryId
      );

    if (verifyError) {
      throw verifyError;
    }

    console.log(
      `✅ Verified ${count} embeddings in database`
    );

    console.log(
      "✅ Chunk embeddings stored"
    );

    console.log(
      "📦 Stored chunks:",
      chunks.length
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