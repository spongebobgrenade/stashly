import type {
  MemoryMetadataV1,
  Save,
} from "../types";

export function buildMetadataLayer(
  save: Save
): MemoryMetadataV1 {
  return {
    title: save.title,
    creatorName:
      save.creator_name,
    sourcePlatform:
      save.source_platform,
    canonicalUrl:
      save.canonical_url,
    thumbnailUrl:
      save.thumbnail_url,
    contentType:
      save.content_type,
    createdAt:
      save.created_at,
    updatedAt:
      save.updated_at,
  };
}
