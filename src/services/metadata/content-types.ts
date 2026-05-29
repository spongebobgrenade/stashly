export type Platform =
  | "youtube"
  | "github"
  | "website"
  | "unknown";

export type ContentType =
  | "video"
  | "short"
  | "playlist"
  | "repository"
  | "article"
  | "website"
  | "unknown";

export type ResolvedContent = {
  platform: Platform;

  contentType: ContentType;

  normalizedUrl: string;

  identifier: string | null;
};