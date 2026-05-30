import Image from "next/image";

import type { Memory } from "@/types/memory";

type MemoryCardProps = {
  memory: Memory;
};

function getStatusLabel(
  status: string | null | undefined
) {
  switch (status) {
    case "queued":
      return "Queued";

    case "processing":
      return "Processing";

    case "completed":
      return "Ready";

    case "failed":
      return "Failed";

    default:
      return "Saving";
  }
}

export function MemoryCard({
  memory,
}: MemoryCardProps) {
  const status = getStatusLabel(
    memory.processing_status
  );

  const memoryUrl =
    memory.canonical_url ??
    memory.original_input ??
    "#";

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
      {memory.thumbnail_url ? (
        <div className="relative w-full aspect-video">
          <Image
            src={memory.thumbnail_url}
            alt={
              memory.title ??
              "Memory thumbnail"
            }
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-zinc-900 flex items-center justify-center text-sm text-zinc-500">
          No Preview
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-zinc-500 uppercase tracking-wide">
            {memory.source_platform ??
              "Unknown"}
          </span>

          <span className="text-xs px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
            {status}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white line-clamp-2">
            {memory.title ??
              "Untitled Memory"}
          </h3>

          <p className="text-sm text-zinc-400 line-clamp-3">
            {memory.description ??
              "Metadata enrichment in progress..."}
          </p>
        </div>

        {memory.creator_name && (
          <p className="text-sm text-zinc-500">
            by {memory.creator_name}
          </p>
        )}

        <a
          href={memoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm text-zinc-300 hover:text-white transition-colors"
        >
          Open Source
        </a>
      </div>
    </div>
  );
}