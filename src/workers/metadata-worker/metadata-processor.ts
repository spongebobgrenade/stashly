import { getSupabaseAdmin } from "@/lib/supabase/admin";

import {
  getEmbeddingProcessingQueue,
} from "@/lib/redis/queues";

import {
  resolveInput,
} from "@/services/metadata/platform-resolver";

import {
  extractMetadata,
} from "@/services/metadata/extractor";

import {
  composeMemoryV1,
} from "@/lib/memory-v1/memory-composer";

import {
  saveMemoryRepresentation,
} from "@/services/memory-representation";

import type {
  ProcessMemoryJob,
} from "@/types/jobs";

import type { Memory } from "@/types/memory";

export async function processMemoryJob(
  jobData: ProcessMemoryJob
) {
  const startedAt = Date.now();

  const { memoryId, url } =
    jobData;

  const supabase =
    getSupabaseAdmin();

  try {
    await supabase
      .from("saves")
      .update({
        processing_status:
          "processing",
      })
      .eq("id", memoryId);

    const {
      data: existingSave,
      error: fetchError,
    } = await supabase
      .from("saves")
      .select("*")
      .eq("id", memoryId)
      .single();

    if (fetchError || !existingSave) {
      throw new Error(
        "Memory not found"
      );
    }

    console.log(
      "🚀 Processing memory job..."
    );

    const resolved =
      resolveInput(url);

    const metadata =
      await extractMetadata(
        resolved
      );

    const enrichedSave: Memory =
      {
        ...existingSave,
        source_platform:
          resolved.platform,
        content_type:
          resolved.contentType,
        title: metadata.title,
        description:
          metadata.description,
        thumbnail_url:
          metadata.thumbnailUrl,
        creator_name:
          metadata.creatorName,
        canonical_url:
          metadata.canonicalUrl,
        raw_metadata:
          metadata.rawMetadata,
      };

    const memoryV1 =
      await composeMemoryV1(
        enrichedSave,
        {
          onKnowledgeExtractionStarted:
            () => {
              console.log(
                "🧠 Knowledge extraction started",
                { memoryId }
              );
            },
          onKnowledgeExtractionCompleted:
            (knowledge) => {
              console.log(
                "✅ Knowledge extraction completed",
                {
                  memoryId,
                  topics:
                    knowledge.topics
                      .length,
                  entities:
                    knowledge.entities
                      .length,
                  keyInsights:
                    knowledge
                      .keyInsights
                      .length,
                }
              );
            },
          onSummaryGenerationCompleted:
            (summary) => {
              console.log(
                "✅ Summary generation completed",
                {
                  memoryId,
                  summaryLength:
                    summary.length,
                }
              );
            },
        }
      );

    console.log(
      "🧱 MemoryV1 composed",
      {
        memoryId,
        transcriptChunks:
          memoryV1.transcript
            .chunks.length,
        retrievalSummaryLength:
          memoryV1.retrieval
            .summary.length,
      }
    );

    await saveMemoryRepresentation(memoryV1);

    console.log(
      "💾 MemoryV1 representation saved",
      {
        memoryId,
      }
    );

    await supabase
      .from("saves")
      .update({
        source_platform:
          resolved.platform,

        content_type:
          resolved.contentType,

        title:
          metadata.title,

        description:
          metadata.description,

        thumbnail_url:
          metadata.thumbnailUrl,

        creator_name:
          metadata.creatorName,

        canonical_url:
          metadata.canonicalUrl,

        raw_metadata:
          metadata.rawMetadata,

        processing_status:
          "completed",
      })
      .eq("id", memoryId);

    await getEmbeddingProcessingQueue().add(
      "generate-embedding",
      {
        memoryId,
      }
    );

    console.log(
      "🧠 Embedding job queued"
    );

    console.log(
      "✅ Memory processing completed"
    );

    console.log(
      "⏱️ Total worker time:",
      Date.now() -
        startedAt,
      "ms"
    );
  } catch (error) {
    console.error(
      "❌ Memory processing failed",
      error
    );

    await supabase
      .from("saves")
      .update({
        processing_status:
          "failed",
      })
      .eq("id", memoryId);

    throw error;
  }
}
