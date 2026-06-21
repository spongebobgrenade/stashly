import { getSupabaseAdmin } from "@/lib/supabase/admin";

import type {
  RetrievalContext,
  RetrievalQuery,
  RetrievalResult,
  SearchMemory,
} from "./retrieval-types";

function includesMatch(
  value: string | null,
  normalizedQuery: string
): boolean {
  return (
    value?.toLowerCase().includes(
      normalizedQuery
    ) ?? false
  );
}

export function getKeywordScore(
  memory: Pick<
    SearchMemory,
    | "title"
    | "creator_name"
    | "description"
    | "original_input"
  >,
  query: string
): number {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  let score = 0;

  if (
    includesMatch(
      memory.title,
      normalizedQuery
    )
  ) {
    score += 10;
  }

  if (
    includesMatch(
      memory.creator_name,
      normalizedQuery
    )
  ) {
    score += 5;
  }

  if (
    includesMatch(
      memory.description,
      normalizedQuery
    )
  ) {
    score += 3;
  }

  if (
    includesMatch(
      memory.original_input,
      normalizedQuery
    )
  ) {
    score += 2;
  }

  return score;
}

export async function keywordRetrievalStrategy(
  input: RetrievalQuery,
  context: RetrievalContext
): Promise<RetrievalResult> {
  const supabase =
    getSupabaseAdmin();

  const trimmedQuery =
    input.query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("saves")
    .select(`
      id,
      user_id,
      content_type,
      original_input,
      source_platform,
      title,
      description,
      thumbnail_url,
      creator_name,
      canonical_url,
      processing_status,
      created_at,
      updated_at
    `)
    .eq(
      "user_id",
      context.userId
    )
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
      "KEYWORD RETRIEVAL ERROR:",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (memory) => {
      const keywordScore =
        getKeywordScore(
          memory,
          trimmedQuery
        );

      return {
        ...memory,
        keywordScore,
        finalScore:
          keywordScore,
      };
    }
  );
}
