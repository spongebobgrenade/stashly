import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type DebugAuthContextRow = {
  auth_uid: string | null;
  visible_memory_rows: number;
  visible_embedding_rows: number;
};

type MemoryIdRow = {
  id: string;
};

type EmbeddingRow = {
  memory_id: string;
  embedding: string | null;
};

type SaveOwnerRow = {
  id: string;
  user_id: string;
};

type SemanticMatchRow = {
  memory_id: string;
  similarity: number;
};

export async function GET() {
  const supabase =
    await createClient();

  const admin =
    getSupabaseAdmin();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
        userError,
      },
      {
        status: 401,
      }
    );
  }

  const {
    count: appVisibleSavesCount,
    error: appVisibleSavesError,
  } = await supabase
    .from("saves")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id);

  const {
    data: allUserMemories,
    error: allUserMemoriesError,
  } = await admin
    .from("saves")
    .select("id")
    .eq("user_id", user.id);

  const allUserMemoryIds =
    (allUserMemories ??
      []) as MemoryIdRow[];

  const userMemoryIds =
    allUserMemoryIds.map(
      (memory) => memory.id
    );

  const {
    count: totalEmbeddingsCount,
    error: totalEmbeddingsError,
  } = await admin
    .from("memory_embeddings")
    .select("id", {
      count: "exact",
      head: true,
    });

  const {
    data: embeddingCandidates,
    error: embeddingCandidatesError,
  } = await admin
    .from("memory_embeddings")
    .select(
      "memory_id, embedding"
    )
    .not("embedding", "is", null)
    .limit(200);

  const candidateRows =
    (embeddingCandidates ??
      []) as EmbeddingRow[];

  const candidateMemoryIds =
    candidateRows.map(
      (row) => row.memory_id
    );

  let candidateOwners:
    | SaveOwnerRow[]
    | null = null;

  let candidateOwnersError:
    | unknown
    | null = null;

  if (
    candidateMemoryIds.length > 0
  ) {
    const {
      data,
      error,
    } = await admin
      .from("saves")
      .select("id, user_id")
      .in("id", candidateMemoryIds);

    candidateOwners =
      (data ?? []) as SaveOwnerRow[];
    candidateOwnersError = error;
  }

  const candidateOwnerMap =
    new Map(
      (candidateOwners ?? []).map(
        (row) => [
          row.id,
          row.user_id,
        ]
      )
    );

  const sampleEmbedding =
    candidateRows.find(
      (row) =>
        candidateOwnerMap.get(
          row.memory_id
        ) === user.id
    ) ?? null;

  const {
    data: authContextRows,
    error: authContextError,
  } = await supabase.rpc(
    "debug_semantic_auth_context",
    {
      target_user_id: user.id,
    }
  );

  const appAuthContext =
    Array.isArray(
      authContextRows
    ) &&
    authContextRows.length > 0
      ? (authContextRows[0] as DebugAuthContextRow)
      : null;

  let adminVisibleEmbeddingsForUserCount:
    | number
    | null = null;

  let adminVisibleEmbeddingsForUserError:
    | unknown
    | null = null;

  if (userMemoryIds.length > 0) {
    const {
      count,
      error,
    } = await admin
      .from("memory_embeddings")
      .select("id", {
        count: "exact",
        head: true,
      })
      .in("memory_id", userMemoryIds);

    adminVisibleEmbeddingsForUserCount =
      count ?? null;
    adminVisibleEmbeddingsForUserError =
      error;
  }

  let userRpcMatches:
    | SemanticMatchRow[]
    | null = null;

  let userRpcError:
    | unknown
    | null = null;

  let adminRpcMatches:
    | SemanticMatchRow[]
    | null = null;

  let adminRpcError:
    | unknown
    | null = null;

  if (sampleEmbedding?.embedding) {
    const {
      data,
      error,
    } = await supabase.rpc(
      "match_memory_embeddings",
      {
        query_embedding:
          sampleEmbedding.embedding,
        match_count: 20,
        target_user_id: user.id,
      }
    );

    userRpcMatches = data;
    userRpcError = error;

    const {
      data: adminData,
      error: adminError,
    } = await admin.rpc(
      "match_memory_embeddings",
      {
        query_embedding:
          sampleEmbedding.embedding,
        match_count: 20,
        target_user_id: user.id,
      }
    );

    adminRpcMatches = adminData;
    adminRpcError =
      adminError;
  }

  return NextResponse.json({
    appUserId: user.id,
    migrationExpected:
      "005_semantic_retrieval_rls_diagnostic.sql",
    appVisibleSavesCount,
    appVisibleSavesError,
    adminVisibleUserMemoryCount:
      userMemoryIds.length,
    allUserMemoriesError,
    totalEmbeddingsCount,
    totalEmbeddingsError,
    embeddingCandidatesScanned:
      candidateRows.length,
    embeddingCandidatesError,
    candidateOwnersResolved:
      candidateOwners?.length ?? 0,
    candidateOwnersError,
    adminVisibleEmbeddingsForUserCount,
    adminVisibleEmbeddingsForUserError,
    sampleEmbeddingFound:
      Boolean(
        sampleEmbedding?.embedding
      ),
    sampleEmbeddingMemoryId:
      sampleEmbedding
        ?.memory_id ?? null,
    sampleEmbeddingOwnerId:
      sampleEmbedding
        ? candidateOwnerMap.get(
            sampleEmbedding.memory_id
          ) ?? null
        : null,
    appAuthContext,
    authContextError,
    userRpcMatchCount:
      userRpcMatches?.length ??
      null,
    userRpcError,
    adminRpcMatchCount:
      adminRpcMatches?.length ??
      null,
    adminRpcError,
    userRpcFirstMatch:
      userRpcMatches?.[0] ?? null,
    adminRpcFirstMatch:
      adminRpcMatches?.[0] ??
      null,
  });
}
