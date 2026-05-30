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

    const memories =
      await retrieveMemories({
        query,
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