import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { extractYoutubeMetadata } from "@/services/metadata/youtube";

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

  const supabase = getSupabaseAdmin();

  // TECH_DEBT:
  // Platform detection currently inline.
  // Move to dedicated platform resolver later.

  let metadata = {
    title: null as string | null,

    description: null as string | null,

    thumbnailUrl: null as string | null,

    creatorName: null as string | null,

    canonicalUrl: null as string | null,

    rawMetadata: null as unknown,

    sourcePlatform: "unknown",
  };

  const extractionStartedAt =
    Date.now();

  // YouTube extraction

  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    metadata =
      await extractYoutubeMetadata(url);
  }

  console.log(
    "⏱️ Metadata extraction:",
    Date.now() -
      extractionStartedAt,
    "ms"
  );

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
    Date.now() - startedAt,
    "ms"
  );

  console.log(
    "✅ Memory processing completed"
  );
}