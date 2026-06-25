import type { GenerateAnswerInput, GenerateAnswerResult } from "./ai-types";

/**
 * Generates a full answer from the Ollama chat completions API (non-streaming).
 * Uses OLLAMA_BASE_URL and OLLAMA_MODEL env vars for configuration.
 */
export async function generateAnswer(
  input: GenerateAnswerInput
): Promise<GenerateAnswerResult> {
  let baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const model = process.env.OLLAMA_MODEL;

  console.log("OLLAMA MODEL:", model);

  if (!model) {
    throw new Error("OLLAMA_MODEL is not configured");
  }

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
        options: {
          temperature: 0.0,
        },
      }),
    });

    if (!response.ok) {
      let errorMessage = `Ollama API returned status ${response.status}`;

      try {
        interface OllamaErrorResponse {
          error?: string;
        }

        const errorData =
          (await response.json()) as OllamaErrorResponse;

        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Ignore JSON parsing errors
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

/**
 * Generates a streaming answer from the Ollama chat completions API.
 * Returns a ReadableStream<string> of text chunks.
 */
export async function generateAnswerStream(
  input: GenerateAnswerInput
): Promise<ReadableStream<string>> {
  let baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const model = process.env.OLLAMA_MODEL;

  console.log("OLLAMA MODEL:", model);

  if (!model) {
    throw new Error("OLLAMA_MODEL is not configured");
  }

  const chatUrl = `${baseUrl}/api/chat`;

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
      stream: true,
      options: {
        temperature: 0.0,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API returned status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body from Ollama API");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;

            try {
              const json = JSON.parse(line);
              const content = json.message?.content;

              if (content) {
                controller.enqueue(content);
              }
            } catch (err) {
              console.error(
                "Error parsing JSON line from stream:",
                err
              );
            }
          }
        }

        if (buffer.trim() !== "") {
          try {
            const json = JSON.parse(buffer);
            const content = json.message?.content;

            if (content) {
              controller.enqueue(content);
            }
          } catch (err) {
            console.error(
              "Error parsing trailing line from stream:",
              err
            );
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}