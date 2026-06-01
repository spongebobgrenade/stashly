import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  retrieveMemories,
} from "@/lib/retrieval/retrieve-memories";

export async function GET(
  request: NextRequest
) {
  try {
    const query =
      request.nextUrl.searchParams.get(
        "q"
      ) ?? "";

    const mode =
      request.nextUrl.searchParams.get(
        "mode"
      ) ?? undefined;

    const memories =
      await retrieveMemories({
        query,
        mode:
          mode === "semantic" ||
          mode === "keyword" ||
          mode === "hybrid"
            ? mode
            : undefined,
      });

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
