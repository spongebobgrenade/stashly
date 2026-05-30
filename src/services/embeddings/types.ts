export type EmbeddingProvider =
  | "ollama"
  | "openrouter"
  | "voyage"
  | "jina";

export type EmbeddingResult = {
  vector: number[];

  dimensions: number;

  provider: EmbeddingProvider;

  model: string;
};

export type EmbeddingGatewayOptions = {
  provider?: EmbeddingProvider;
};