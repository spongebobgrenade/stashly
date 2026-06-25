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

    const body = await response.text();

    if (!response.ok) {
    throw new Error(
      `Ollama returned ${response.status}: ${body}`
    );
  }
  
  const data = JSON.parse(body);

  const vector = data.embedding;

  if (
    !Array.isArray(vector) ||
    vector.length === 0
  ) {
  throw new Error(
    "Ollama returned an invalid embedding."
  );
}

  return {
    vector,

    dimensions:
      vector.length,

    provider:
      "ollama",

    model: MODEL,
  };
}