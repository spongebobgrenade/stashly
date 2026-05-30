import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { data, error } =
    await supabase
      .from("saves")
      .select("*")
      .eq("user_id", user.id)
      .neq(
        "processing_status",
        "completed"
      )
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