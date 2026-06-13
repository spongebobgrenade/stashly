import type { RetrievalDocumentV1 } from "./types";

/**
 * Deterministically renders a RetrievalDocumentV1 into a consistent text
 * format suitable for embedding generation.
 */
export function renderRetrievalDocument(
  doc: RetrievalDocumentV1
): string {
  const parts: string[] = [];

  if (doc.title) {
    parts.push(doc.title);
  }

  if (doc.summary) {
    parts.push(doc.summary);
  }

  if (doc.creatorName) {
    parts.push(
      `Creator: ${doc.creatorName}`
    );
  }

  if (doc.topics.length > 0) {
    parts.push(
      `Topics: ${doc.topics
        .map(
          (topic) =>
            topic.name
        )
        .join(", ")}`
    );
  }

  if (doc.entities.length > 0) {
    parts.push(
      `Entities: ${doc.entities
        .map(
          (entity) =>
            entity.name
        )
        .join(", ")}`
    );
  }

  if (
    doc.keyInsights.length >
    0
  ) {
    parts.push(
      `Key Insights:\n${doc.keyInsights
        .map(
          (insight) =>
            `- ${insight}`
        )
        .join("\n")}`
    );
  }

  if (
    doc.userNotes.length >
    0
  ) {
    parts.push(
      `User Notes:\n${doc.userNotes
        .map(
          (note) =>
            `- ${note}`
        )
        .join("\n")}`
    );
  }

  return parts
    .filter(Boolean)
    .join("\n\n")
    .trim();
}