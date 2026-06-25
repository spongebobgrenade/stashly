import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { getMemoryProcessingQueue } from "@/lib/redis/queues";

import { isValidUrl } from "@/lib/validators/memory";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const { url } = body;

    if (!url) {
      return NextResponse.json(
        {
          error: "URL is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        {
          error: "Invalid URL",
        },
        {
          status: 400,
        }
      );
    }

    const memoryId = randomUUID();

    const { data: memory, error } =
      await supabase
        .from("saves")
        .insert({
          id: memoryId,

          user_id: user.id,

          original_input: url,

          content_type: "link",

          source_platform: "unknown",

          processing_status:
            "queued",
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    await getMemoryProcessingQueue().add(
      "process-memory",
      {
        memoryId,

        url,

        userId: user.id,
      },
      {
        jobId: memoryId,
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    return NextResponse.json({
      success: true,
      memory,
    });
  } catch (error) {
    console.error(
      "MEMORY SAVE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}