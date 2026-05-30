"use client";

import { useEffect, useState } from "react";

import type { Memory } from "@/types/memory";

export function useSearch(query: string) {
  const [results, setResults] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`
        );

        const data = await response.json();

        setResults(data.memories ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return {
    results,
    loading,
  };
}