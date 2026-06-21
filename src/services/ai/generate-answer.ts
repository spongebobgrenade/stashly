import type { GenerateAnswerInput, GenerateAnswerResult } from "./ai-types";

/**
 * Generates an answer from the Ollama chat completions API.
 * Uses OLLAMA_BASE_URL and OLLAMA_MODEL env vars for configuration.
 */
export async function generateAnswer(
  input: GenerateAnswerInput
): Promise<GenerateAnswerResult> {
  let baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const model = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";
  const chatUrl = `${baseUrl}/api/chat`;

  try {
    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Ollama API returned status ${response.status}`;
      try {
        interface OllamaErrorResponse {
          error?: string;
        }
        const errorData = (await response.json()) as OllamaErrorResponse;
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback if parsing fails
      }

      if (
        errorMessage.toLowerCase().includes("not found") ||
        response.status === 404
      ) {
        throw new Error(
          `Configured model '${model}' is not installed in Ollama`
        );
      }
      throw new Error(errorMessage);
    }

    interface OllamaResponse {
      message?: {
        content?: string;
      };
    }

    const data = (await response.json()) as OllamaResponse;
    const answer = data.message?.content;

    if (typeof answer !== "string") {
      throw new Error("Invalid response schema from Ollama API");
    }

    return { answer };
  } catch (error: unknown) {
    const isNetworkError =
      error instanceof TypeError ||
      (error as { code?: string }).code === "ECONNREFUSED" ||
      (error as Error).message?.toLowerCase().includes("fetch failed");

    if (isNetworkError) {
      throw new Error("Ollama is not running");
    }
    throw error;
  }
}
