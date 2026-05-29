import { NextRequest, NextResponse } from "next/server";
import { searchMemories } from "@/lib/memories/search-memories";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") ?? "";

    const memories = await searchMemories(query);

    return NextResponse.json({
      memories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Search failed",
      },
      {
        status: 500,
      }
    );
  }
}