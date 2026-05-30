import { createClient } from "@/lib/supabase/server";

import type { Memory } from "@/types/memory";

export async function searchMemories(
  query: string
): Promise<Memory[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const { data, error } = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", user.id)
    .or(
      [
        `title.ilike.%${trimmedQuery}%`,
        `description.ilike.%${trimmedQuery}%`,
        `creator_name.ilike.%${trimmedQuery}%`,
        `source_platform.ilike.%${trimmedQuery}%`,
        `original_input.ilike.%${trimmedQuery}%`,
      ].join(",")
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(50);

  if (error) {
    console.error(
      "SEARCH ERROR:",
      error
    );

    return [];
  }

  return data ?? [];
}