import {
  generateOllamaEmbedding,
} from "./providers/ollama";

import type {
  EmbeddingGatewayOptions,
} from "./types";

const DEFAULT_PROVIDER =
  "ollama";

export async function generateEmbedding(
  text: string,

  options?: EmbeddingGatewayOptions
) {
  const provider =
    options?.provider ??
    DEFAULT_PROVIDER;

  switch (provider) {
    case "ollama":
      return generateOllamaEmbedding(
        text
      );

    default:
      throw new Error(
        `Unsupported embedding provider: ${provider}`
      );
  }
}