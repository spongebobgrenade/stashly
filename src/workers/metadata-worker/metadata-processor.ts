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

import type {
  ProcessMemoryJob,
} from "@/types/jobs";

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

    console.log(
      "🚀 Processing memory job..."
    );

    const resolved =
      resolveInput(url);

    const metadata =
      await extractMetadata(
        resolved
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