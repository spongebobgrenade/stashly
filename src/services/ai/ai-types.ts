export interface GenerateAnswerInput {
  systemPrompt: string;
  userPrompt: string;
}

export interface GenerateAnswerResult {
  answer: string;
}
