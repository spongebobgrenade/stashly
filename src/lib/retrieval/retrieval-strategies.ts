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

function sanitizeKeywordQuery(
  query: string
): string {
  return query
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/,/g, " ")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/%/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function getKeywordScoreTokens(
  memory: Pick<
    SearchMemory,
    | "title"
    | "creator_name"
    | "description"
    | "original_input"
  >,
  tokens: string[],
  docCounts: Map<string, number>,
  totalDocs: number
): number {
  let score = 0;
  const titleLower = (memory.title || "").toLowerCase();
  const descLower = (memory.description || "").toLowerCase();
  const creatorLower = (memory.creator_name || "").toLowerCase();
  const inputLower = (memory.original_input || "").toLowerCase();

  for (const token of tokens) {
    const df = docCounts.get(token) || 1;
    const idf = totalDocs / df;

    let tokenScore = 0;
    if (titleLower.includes(token)) {
      tokenScore += 10;
      if (new RegExp(`\\b${token}\\b`).test(titleLower)) {
        tokenScore += 5;
      }
    }
    if (creatorLower.includes(token)) {
      tokenScore += 5;
      if (new RegExp(`\\b${token}\\b`).test(creatorLower)) {
        tokenScore += 2;
      }
    }
    if (descLower.includes(token)) {
      tokenScore += 3;
      if (new RegExp(`\\b${token}\\b`).test(descLower)) {
        tokenScore += 1;
      }
    }
    if (inputLower.includes(token)) {
      tokenScore += 2;
    }
    score += tokenScore * idf;
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
    );

  if (error) {
    console.error(
      "KEYWORD RETRIEVAL ERROR:",
      error
    );

    return [];
  }

  const STOP_WORDS = new Set([
    "summarize", "summary", "save", "saves", "compare", "comparison", "difference", "between",
    "what", "who", "where", "when", "why", "how", "which",
    "is", "are", "was", "were", "be", "been", "being",
    "a", "an", "the", "and", "or", "but", "if", "then", "else",
    "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once",
    "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "should", "now",
    "tell", "me", "more", "details", "info", "information", "link", "links", "url", "urls", "video", "videos",
    "my", "your", "our", "his", "her", "their", "its", "i", "you", "he", "she", "it", "we", "they", "them", "us", "him", "her", "hers", "yours", "ours", "theirs"
  ]);

  const tokens = trimmedQuery
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  if (tokens.length === 0) {
    const safeQuery = sanitizeKeywordQuery(trimmedQuery);
    if (!safeQuery) {
      return [];
    }

    return (data ?? [])
      .filter((memory) => (
        includesMatch(memory.title, safeQuery) ||
        includesMatch(memory.creator_name, safeQuery) ||
        includesMatch(memory.description, safeQuery) ||
        includesMatch(memory.original_input, safeQuery)
      ))
      .map((memory) => {
        const keywordScore = getKeywordScore(memory, safeQuery);
        return {
          ...memory,
          keywordScore,
          finalScore: keywordScore,
        };
      })
      .sort((a, b) => (b.keywordScore ?? 0) - (a.keywordScore ?? 0))
      .slice(0, 50);
  }

  // Count document frequency (DF) for each token
  const docCounts = new Map<string, number>();
  const savesList = data ?? [];
  for (const token of tokens) {
    let count = 0;
    for (const s of savesList) {
      const text = `${s.title} ${s.description} ${s.creator_name} ${s.original_input}`.toLowerCase();
      if (text.includes(token)) {
        count++;
      }
    }
    docCounts.set(token, count || 1);
  }

  return savesList
    .map((memory) => {
      const keywordScore = getKeywordScoreTokens(memory, tokens, docCounts, savesList.length);
      return {
        ...memory,
        keywordScore,
        finalScore: keywordScore,
      };
    })
    .filter((memory) => memory.keywordScore > 0)
    .sort((a, b) => b.keywordScore - a.keywordScore)
    .slice(0, 50);
}