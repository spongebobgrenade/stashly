import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PIPELINE_VERSION } from "@/lib/pipeline/version";

async function main() {
  console.log("🔍 Running Corpus Audit...");

  const supabase = getSupabaseAdmin();

  const { data: saves, error: savesError } = await supabase
    .from("saves")
    .select(`
      id,
      title,
      original_input,
      processing_status,
      pipeline_version
    `);

  if (savesError || !saves) {
    console.error("❌ Failed to fetch saves:", savesError);
    process.exit(1);
  }

  const { data: representations, error: repError } = await supabase
    .from("memory_representations")
    .select("memory_id");

  if (repError || !representations) {
    console.error("❌ Failed to fetch representations:", repError);
    process.exit(1);
  }

  const { data: embeddings, error: embError } = await supabase
    .from("memory_embeddings")
    .select("memory_id");

  if (embError || !embeddings) {
    console.error("❌ Failed to fetch embeddings:", embError);
    process.exit(1);
  }

  const representationIds = new Set(
    representations.map((r) => r.memory_id)
  );

  const embeddingIds = new Set(
    embeddings.map((e) => e.memory_id)
  );

  const totalEmbeddingRows = embeddings.length;

  const savesWithRep = saves.filter((s) =>
    representationIds.has(s.id)
  );

  const savesWithEmb = saves.filter((s) =>
    embeddingIds.has(s.id)
  );

  const missingRep = saves.filter(
    (s) => !representationIds.has(s.id)
  );

  const missingEmb = saves.filter(
    (s) => !embeddingIds.has(s.id)
  );

  const currentVersion = saves.filter(
    (s) => s.pipeline_version === PIPELINE_VERSION
  );

  const oldVersion = saves.filter(
    (s) => s.pipeline_version !== PIPELINE_VERSION
  );

  const failed = saves.filter(
    (s) => s.processing_status === "failed"
  );

  // -------- Corpus Health --------

  const healthy = saves.filter(
    (s) =>
      s.processing_status === "completed" &&
      s.pipeline_version === PIPELINE_VERSION &&
      representationIds.has(s.id) &&
      embeddingIds.has(s.id)
  );

  const healthMissingRep = saves.filter(
    (s) =>
      s.processing_status !== "failed" &&
      !representationIds.has(s.id)
  );

  const healthMissingEmb = saves.filter(
    (s) =>
      s.processing_status !== "failed" &&
      representationIds.has(s.id) &&
      !embeddingIds.has(s.id)
  );

  const healthOldPipeline = saves.filter(
    (s) =>
      s.processing_status !== "failed" &&
      s.pipeline_version !== PIPELINE_VERSION
  );

  console.log("\n==============================");
  console.log("Corpus Statistics");
  console.log("==============================");

  console.log(`• Total saves: ${saves.length}`);
  console.log(`• Saves with representations: ${savesWithRep.length}`);
  console.log(`• Saves with embeddings (unique): ${savesWithEmb.length}`);
  console.log(`• Total embedding rows: ${totalEmbeddingRows}`);
  console.log(`• Saves missing representations: ${missingRep.length}`);
  console.log(`• Saves missing embeddings: ${missingEmb.length}`);
  console.log(`• Current pipeline (${PIPELINE_VERSION}): ${currentVersion.length}`);
  console.log(`• Older / NULL pipeline: ${oldVersion.length}`);
  console.log(`• Failed saves: ${failed.length}`);

  console.log("\n==============================");
  console.log("Pipeline Health");
  console.log("==============================");

  console.log(`✅ Healthy: ${healthy.length}`);
  console.log(`⚠ Missing Representation: ${healthMissingRep.length}`);
  console.log(`⚠ Missing Embedding: ${healthMissingEmb.length}`);
  console.log(`⚠ Old Pipeline Version: ${healthOldPipeline.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  type Save = (typeof saves)[number];
  function printSection(
    title: string,
    rows: Save[]
  ) {
    if (rows.length === 0) return;

    console.log("\n==============================");
    console.log(title);
    console.log("==============================");

    rows.forEach((save) => {
      console.log(`ID       : ${save.id}`);
      console.log(`Title    : ${save.title ?? "(no title)"}`);
      console.log(`Status   : ${save.processing_status}`);
      console.log(`Pipeline : ${save.pipeline_version ?? "NULL"}`);
      console.log(`URL      : ${save.original_input}`);
      console.log("");
    });
  }

  printSection("Missing Representations", healthMissingRep);
  printSection("Missing Embeddings", healthMissingEmb);
  printSection("Old Pipeline Versions", healthOldPipeline);
  printSection("Failed Saves", failed);

  console.log("✅ Audit complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});