"use client";

import { useState } from "react";

import {
  useMemoryStore,
} from "@/lib/memories/store";

export default function SaveForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] =
    useState(false);

  const addOptimisticMemory =
    useMemoryStore(
      (state) =>
        state.addOptimisticMemory
    );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    const submittedUrl = url;

    setUrl("");

    addOptimisticMemory(submittedUrl);

    try {
      setLoading(true);

      const response = await fetch(
        "/api/memories/save",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            url: submittedUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save memory"
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        type="url"
        placeholder="Paste a link to save..."
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-zinc-600"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save"}
      </button>
    </form>
  );
}