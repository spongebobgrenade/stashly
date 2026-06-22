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

    const { message, history } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate and harden conversation history
    const validatedHistory: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(history)) {
      for (const entry of history) {
        if (
          entry &&
          typeof entry === "object" &&
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string"
        ) {
          const trimmedContent = entry.content.trim();
          if (trimmedContent !== "") {
            const truncatedContent = trimmedContent.slice(0, 1000);
            validatedHistory.push({
              role: entry.role,
              content: truncatedContent,
            });
          }
        }
      }
    }
    const finalHistory = validatedHistory.slice(-10);

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
    const topMemories = memories.slice(0, 8);

    // 5. Build context
    const contextBlock = topMemories
      .map((m, idx) => {
        const label = `[Memory ${idx + 1}]`;
        const title = m.title || "Untitled";
        const description = m.description || "No description";
        const originalInput = m.original_input || "N/A";
        return `${label}
Memory ID: ${m.id}
Title: ${title}
Description: ${description}
Original Input: ${originalInput}`;
      })
      .join("\n\n");

    // 6. Build system and user prompts
    const systemPrompt = `You are Stashly Memory Chat.

You answer questions ONLY using the retrieved memories provided.

Rules:

1. Use only information present in the memory context.

2. Do not use outside knowledge.

3. Do not infer facts that are not explicitly supported by the memories.

4. When information comes from a memory, cite it using:

[Memory X]

Example:

Protein is important for muscle growth [Memory 2]

5. Multiple citations are allowed.

Example:

Protein supports muscle growth [Memory 2]
and recovery [Memory 4].

6. If the retrieved memories do not contain enough information
to answer confidently, respond exactly with:

"I could not find that in your saved memories."

7. Never fabricate citations.

8. Never reference memories that were not provided.

9. Prefer concise answers over long explanations.`;

    let historyBlock = "";
    if (finalHistory.length > 0) {
      const historyLines = finalHistory
        .map((h) => {
          const roleLabel = h.role === "user" ? "User" : "Assistant";
          return `${roleLabel}: ${h.content}`;
        })
        .join("\n");

      historyBlock = `Conversation History:

${historyLines}`;
    }

    const promptParts: string[] = [];
    if (historyBlock) {
      promptParts.push(historyBlock);
    }
    promptParts.push(
      `Retrieved Memory Context:\n${contextBlock || "No memories retrieved."}`
    );
    promptParts.push(`Current Question:\n${message}`);

    const userPrompt = promptParts.join("\n\n");

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
