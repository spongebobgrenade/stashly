import { createClient } from "@/lib/supabase/client";

import { useMemoryStore } from "@/lib/memories/store";

import type { Memory } from "@/types/memory";

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

let channel: RealtimeChannel | null = null;

export async function initializeMemoryRealtime() {
  const supabase = createClient();

  if (channel) {
    await supabase.removeChannel(channel);
    channel = null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.warn(
      "No session found — realtime will not initialize. User is not authenticated."
    );

    return;
  }

  console.log(
    "Initializing singleton realtime..."
  );

  channel = supabase
    .channel("memories-feed", {
      config: {
        broadcast: {
          self: true,
        },
      },
    })
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "saves",
        filter: `user_id=eq.${session.user.id}`,
      },
      (
        payload: RealtimePostgresChangesPayload<Record<string, unknown>>
      ) => {
        const updatedMemory =
          payload.new as Memory;

        if (!updatedMemory?.id) {
          return;
        }

        useMemoryStore
          .getState()
          .upsertMemory(
            updatedMemory
          );
      }
    )
    .subscribe();
}

export async function teardownMemoryRealtime() {
  const supabase =
    createClient();

  if (channel) {
    await supabase.removeChannel(
      channel
    );

    channel = null;
  }
}