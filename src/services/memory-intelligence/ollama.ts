const OLLAMA_GENERATE_URL =
  "http://localhost:11434/api/generate";

const DEFAULT_MODEL =
  process.env
    .OLLAMA_GENERATION_MODEL ??
  "llama3.2:3b";

type OllamaGenerateOptions = {
  format?: "json";
  numPredict?: number;
  temperature?: number;
};

export async function generateWithOllama(
  prompt: string,
  options: OllamaGenerateOptions = {}
): Promise<string> {
  const response =
    await fetch(
      OLLAMA_GENERATE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          prompt,
          format:
            options.format,
          stream: false,
          options: {
            temperature:
              options.temperature ??
              0.1,
            num_predict:
              options.numPredict ??
              300,
          },
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Ollama generation failed with status ${response.status}`
    );
  }

  const data =
    (await response.json()) as {
      response?: string;
    };

  const output =
    data.response?.trim();

  if (!output) {
    throw new Error(
      "Ollama generation returned empty output"
    );
  }

  return output;
}
