import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retrieveMemories } from "@/lib/retrieval/retrieve-memories";
import { generateAnswer } from "@/services/ai/generate-answer";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user using existing Supabase pattern
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Parse request JSON
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { message } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // 3. Retrieve memories using hybrid mode
    const memories = await retrieveMemories(
      {
        query: message,
        mode: "hybrid",
      },
      {
        userId: user.id,
      }
    );

    // 4. Take top 10 memories
    const topMemories = memories.slice(0, 10);

    // 5. Build context
    const contextBlock = topMemories
      .map((m, idx) => {
        const title = m.title || "Untitled";
        const description = m.description || "No description";
        const originalInput = m.original_input || "N/A";
        return `Memory #${idx + 1}:
Title: ${title}
Description: ${description}
Original Input: ${originalInput}
`;
      })
      .join("\n---\n\n");

    // 6. Build system and user prompts
    const systemPrompt = `You answer questions only using the supplied memory context.
If the answer is not present in memory context, say:
"I could not find that in your saved memories."`;

    const userPrompt = `User question: ${message}

Retrieved Memory Context:
${contextBlock || "No memories retrieved."}`;

    // 7. Call generateAnswer()
    const { answer } = await generateAnswer({
      systemPrompt,
      userPrompt,
    });

    // 8. Return response
    return NextResponse.json({
      answer,
      memories: topMemories,
    });
  } catch (error: unknown) {
    console.error("Memory chat error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Chat endpoint error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
