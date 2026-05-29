import { getSupabaseAdmin } from "@/lib/supabase/admin";

import {
  resolveInput,
} from "@/services/metadata/platform-resolver";

import {
  extractMetadata,
} from "@/services/metadata/extractor";

type ProcessMemoryJob = {
  memoryId: string;
  url: string;
  userId: string;
};

export async function processMemoryJob(
  jobData: ProcessMemoryJob
) {
  const startedAt = Date.now();

  const { memoryId, url } = jobData;

  console.log("🚀 Processing memory job...");
  console.log(jobData);

  const supabase =
    getSupabaseAdmin();

  const extractionStartedAt =
    Date.now();

  const resolved =
    resolveInput(url);

  console.log(
    "Resolved content:",
    resolved
  );

  const metadata =
    await extractMetadata(
      resolved
    );

  console.log(
    "⏱️ Metadata extraction:",
    Date.now() -
      extractionStartedAt,
    "ms"
  );

  if (
    !metadata.title &&
    !metadata.description &&
    !metadata.thumbnailUrl
  ) {
    console.warn(
      "No metadata extracted for:",
      url
    );
  }

  console.log(
    "Updating memory:",
    memoryId
  );

  const dbUpdateStartedAt =
    Date.now();

  const { data, error } =
    await supabase
      .from("saves")
      .update({
        source_platform:
          metadata.sourcePlatform,

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
      .eq("id", memoryId)
      .select();

  console.log(
    "⏱️ Database update:",
    Date.now() -
      dbUpdateStartedAt,
    "ms"
  );

  if (error) {
    console.error(
      "SUPABASE UPDATE ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "Updated rows:",
    data
  );

  console.log(
    "⏱️ Total worker time:",
    Date.now() -
      startedAt,
    "ms"
  );

  console.log(
    "✅ Memory processing completed"
  );
}