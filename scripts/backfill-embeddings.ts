import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env.local"
  ),
});

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getEmbeddingProcessingQueue } from "@/lib/redis/queues";

async function main() {
  const supabase = getSupabaseAdmin();

  const { data: memories, error } = await supabase
    .from("saves")
    .select("id")
    .order("created_at");

  if (error) {
    throw error;
  }

  const queue =
    getEmbeddingProcessingQueue();

  let queuedCount = 0;

  for (const memory of memories ?? []) {
    const {
      data: existingEmbedding,
    } = await supabase
      .from("memory_embeddings")
      .select("id")
      .eq("memory_id", memory.id)
      .limit(1)
      .maybeSingle();

    if (existingEmbedding) {
      continue;
    }

    await queue.add(
      "generate-embedding",
      {
        memoryId: memory.id,
      }
    );

    queuedCount++;

    console.log(
      `Queued ${memory.id}`
    );
  }

  console.log(
    `Done. Queued ${queuedCount} memories.`
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});