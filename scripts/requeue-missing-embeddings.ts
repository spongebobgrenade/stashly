import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env.local"
  ),
});

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PIPELINE_VERSION } from "@/lib/pipeline/version";
import { getMemoryRepresentation } from "@/services/memory-representation";
import { getEmbeddingProcessingQueue } from "@/lib/redis/queues";

async function main() {
  const supabase = getSupabaseAdmin();

  // 1. Query saves with completed status and PIPELINE_VERSION
  const { data: saves, error: savesError } = await supabase
    .from("saves")
    .select("id")
    .eq("processing_status", "completed")
    .eq("pipeline_version", PIPELINE_VERSION);

  if (savesError) {
    throw savesError;
  }

  const totalSavesCount = saves?.length ?? 0;
  console.log(`Found ${totalSavesCount} completed saves.`);
  console.log("Checking representations...");

  let skippedAlreadyEmbedded = 0;
  let skippedNoRep = 0;
  let skippedNoChunks = 0;
  let queuedCount = 0;

  const queue = getEmbeddingProcessingQueue();

  console.log("Queued embedding recovery:");

  for (const save of saves ?? []) {
    const memoryId = save.id;

    // Load MemoryV1 representation
    const memoryV1 = await getMemoryRepresentation(memoryId);
    if (!memoryV1) {
      skippedNoRep++;
      continue;
    }

    // Check transcript chunks
    const chunks = memoryV1.transcript?.chunks;
    if (!chunks || chunks.length === 0) {
      skippedNoChunks++;
      continue;
    }

    // Query memory_embeddings for that memory_id
   const {
     count,
     error: embError,
   } = await supabase
     .from("memory_embeddings")
     .select("*", {
       head: true,
       count: "exact",
     })
     .eq("memory_id", memoryId);

   if (embError) {
     throw embError;
   }

   if ((count ?? 0) > 0) {
     skippedAlreadyEmbedded++;
     continue;
   }

    // Enqueue embedding job
    await queue.add(
      "generate-embedding",
      {
        memoryId,
      },
      {
        jobId: memoryId,
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    queuedCount++;
    console.log(`✓ ${memoryId}`);
  }

  console.log(`\nSkipped (already embedded): ${skippedAlreadyEmbedded}`);
  console.log(`Skipped (no representation): ${skippedNoRep}`);
  console.log(`Skipped (no transcript chunks): ${skippedNoChunks}`);
  console.log(`Queued: ${queuedCount}`);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
