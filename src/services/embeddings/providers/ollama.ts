import type {
  EmbeddingResult,
} from "../types";

const OLLAMA_URL =
  "http://localhost:11434/api/embeddings";

const MODEL =
  "nomic-embed-text";

export async function generateOllamaEmbedding(
  text: string
): Promise<EmbeddingResult> {
  const response =
    await fetch(
      OLLAMA_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: MODEL,
          prompt: text,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to generate embedding"
    );
  }

  const data =
    await response.json();

  const vector =
    data.embedding as number[];

  return {
    vector,

    dimensions:
      vector.length,

    provider:
      "ollama",

    model: MODEL,
  };
}