import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { MemoryV1 } from "@/lib/memory-v1/types";

export async function saveMemoryRepresentation(memoryV1: MemoryV1): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("memory_representations")
    .upsert({
      memory_id: memoryV1.memoryId,
      version: memoryV1.version,
      representation: memoryV1 as unknown as Record<string, any>,
    }, { onConflict: "memory_id" });

  if (error) {
    throw new Error(`Failed to save memory representation: ${error.message}`);
  }
}

export async function getMemoryRepresentation(memoryId: string): Promise<MemoryV1 | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("memory_representations")
    .select("representation")
    .eq("memory_id", memoryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to get memory representation: ${error.message}`);
  }

  return data?.representation as unknown as MemoryV1;
}
