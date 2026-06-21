import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  retrieveMemories,
} from "@/lib/retrieval/retrieve-memories";

import {
  logSearchEvent,
} from "@/lib/analytics/log-search-event";

export async function GET(
  request: NextRequest
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const query =
      request.nextUrl.searchParams.get(
        "q"
      ) ?? "";

    const mode =
      request.nextUrl.searchParams.get(
        "mode"
      ) ?? undefined;

    const retrievalMode =
      mode === "semantic" ||
      mode === "keyword" ||
      mode === "hybrid"
        ? mode
        : undefined;

    if (!user) {
      return NextResponse.json({
        memories: [],
      });
    }

    const memories =
      await retrieveMemories(
        {
          query,
          mode:
            retrievalMode,
        },
        {
          userId:
            user.id,
        }
      );

    if (query.trim()) {
      void logSearchEvent({
        userId: user.id,
        query: query.trim(),
        retrievalMode:
          retrievalMode ??
          "keyword",
        resultsCount:
          memories.length,
      });
    }

    return NextResponse.json({
      memories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Search failed",
      },
      {
        status: 500,
      }
    );
  }
}