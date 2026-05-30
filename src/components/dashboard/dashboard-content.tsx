"use client";

import { useState } from "react";

import { MemoryFeed } from "@/components/memory-feed";

import { MemoryBootstrap } from "@/components/memory/memory-bootstrap";

import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { SearchEmpty } from "@/components/search/search-empty";

import { useSearch } from "@/hooks/use-search";

import type { Memory } from "@/types/memory";

type DashboardContentProps = {
  initialMemories: Memory[];
};

export default function DashboardContent({
  initialMemories,
}: DashboardContentProps) {
  const [query, setQuery] =
    useState("");

  const trimmedQuery =
    query.trim();

  const {
    results,
    loading,
  } = useSearch(trimmedQuery);

  return (
    <>
      <MemoryBootstrap
        initialMemories={
          initialMemories
        }
      />

      <SearchBar
        value={query}
        onChange={setQuery}
      />

      <div className="mt-6">
        {!trimmedQuery && (
          <MemoryFeed />
        )}

        {trimmedQuery &&
          loading && (
            <div className="text-sm text-zinc-500">
              Searching...
            </div>
          )}

        {trimmedQuery &&
          !loading &&
          results.length === 0 && (
            <SearchEmpty />
          )}

        {trimmedQuery &&
          !loading &&
          results.length > 0 && (
            <SearchResults
              memories={results}
            />
          )}
      </div>
    </>
  );
}