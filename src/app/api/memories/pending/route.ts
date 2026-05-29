import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("saves")
    .select("*")
    .neq("processing_status", "completed")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch pending memories:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch pending memories",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(data);
}