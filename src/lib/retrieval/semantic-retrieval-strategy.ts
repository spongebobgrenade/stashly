import { createClient } from "@/lib/supabase/server";

import {
  generateEmbedding,
} from "@/services/embeddings/gateway";

import type {
  RetrievalQuery,
  RetrievalResult,
  SemanticMatch,
} from "./retrieval-types";

export async function semanticRetrievalStrategy(
  input: RetrievalQuery
): Promise<RetrievalResult> {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const trimmedQuery =
    input.query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const embedding =
    await generateEmbedding(
      trimmedQuery
    );

  const {
    data: matches,
    error,
  } = await supabase.rpc(
    "match_memory_embeddings",
    {
      query_embedding:
        JSON.stringify(
          embedding.vector
        ),

      match_count: 20,
    }
  );

  if (error) {
    console.error(
      "SEMANTIC RETRIEVAL ERROR:",
      error
    );

    return [];
  }

  if (
    !matches ||
    matches.length === 0
  ) {
    return [];
  }

  const memoryIds =
    matches.map(
      (
        match: SemanticMatch
      ) => match.memory_id
    );

  const {
    data: memories,
    error: memoriesError,
  } = await supabase
    .from("saves")
    .select("*")
    .in("id", memoryIds);

  if (memoriesError) {
    console.error(
      memoriesError
    );

    return [];
  }

  return memories ?? [];
}
