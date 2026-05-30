export function buildMemoryChunks(
  memory: {
    title: string | null;
    description: string | null;
    creator_name:
      | string
      | null;
  }
): string[] {
  return [
    [
      memory.title,
      memory.description,
      memory.creator_name,
    ]
      .filter(Boolean)
      .join("\n"),
  ];
}