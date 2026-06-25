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
import { reprocessSave } from "@/lib/pipeline/reprocess-save";

async function main() {
  const supabase = getSupabaseAdmin();

  const { data: saves, error } = await supabase
    .from("saves")
    .select("id, original_input, user_id")
    .neq("processing_status", "processed")
    .or(`pipeline_version.is.null,pipeline_version.neq.${PIPELINE_VERSION}`)
    .order("created_at");

  if (error) {
    throw error;
  }

  let queuedCount = 0;

  for (const save of saves ?? []) {
    await reprocessSave(save.id, save.original_input, save.user_id);
    queuedCount++;
    console.log(`Queued save ${save.id} (URL: ${save.original_input})`);
  }

  console.log(`Done. Queued ${queuedCount} saves.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
