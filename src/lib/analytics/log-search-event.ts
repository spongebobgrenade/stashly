import { getSupabaseAdmin } from "@/lib/supabase/admin";

interface LogSearchEventParams {
  userId: string;
  query: string;
  retrievalMode: string;
  resultsCount: number;
}

export async function logSearchEvent({
  userId,
  query,
  retrievalMode,
  resultsCount,
}: LogSearchEventParams): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("search_events")
      .insert({
        user_id: userId,
        query,
        retrieval_mode: retrievalMode,
        results_count: resultsCount,
      });

    if (error) {
      console.error("Failed to log search event to analytics:", error);
    }
  } catch (error) {
    console.error("Failed to log search event to analytics (exception):", error);
  }
}
