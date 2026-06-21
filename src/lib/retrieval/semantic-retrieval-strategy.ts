import { getSupabaseAdmin } from "@/lib/supabase/admin";

import {
  generateEmbedding,
} from "@/services/embeddings/gateway";

import type {
  RetrievalContext,
  RetrievalQuery,
  RetrievalResult,
  SemanticMatch,
  SearchMemory
} from "./retrieval-types";

export async function semanticRetrievalStrategy(
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

  let embedding;

  try {
    embedding =
      await generateEmbedding(
        trimmedQuery
      );
  } catch (error) {
    console.error(
      "EMBEDDING GENERATION ERROR:",
      error
    );

    return [];
  }

  const {
    data: matches,
    error,
  } = await supabase.rpc(
    "match_memory_embeddings_for_user",
    {
      query_embedding:
        JSON.stringify(
          embedding.vector
        ),
      match_count: 20,
      target_user_id:
        context.userId,
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
    Array.from<string>(
      new Set(
        matches.map(
          (
            match: SemanticMatch
          ) => match.memory_id
        )
      )
    );

  const {
    data: memories,
    error: memoriesError,
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
    .in("id", memoryIds);

  if (memoriesError) {
    console.error(
      memoriesError
    );

    return [];
  }

  const memoryMap =
    new Map<
      string,
      SearchMemory
    >(
      (memories ?? []).map(
        (memory) => {
          const match =
            matches.find(
              (
                candidate: SemanticMatch
              ) =>
                candidate.memory_id ===
                memory.id
            );

          const searchMemory:
            SearchMemory = {
              ...memory,
            };

          if (
            match?.similarity !==
            undefined
          ) {
            searchMemory.similarity =
              match.similarity;
            searchMemory.semanticScore =
              match.similarity;
            searchMemory.finalScore =
              match.similarity;
          }

          return [
            memory.id,
            searchMemory,
          ];
        }
      )
    );

  return memoryIds
    .map((id) =>
      memoryMap.get(id)
    )
    .filter(

    (

      memory

    ): memory is SearchMemory =>

      memory !== undefined

  );
}
