import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { evaluateSearchQueries } from "@/lib/retrieval/evaluate-search";

interface BenchmarkCase {
  query: string;
  mustContain?: string[];
  minResults?: number;
  maxResults?: number;
}

async function main() {
  const userId = process.env.SEARCH_EVAL_USER_ID;
  if (!userId) {
    console.error("Error: SEARCH_EVAL_USER_ID environment variable is missing.");
    process.exit(1);
  }

  const benchmarksPath = path.resolve(process.cwd(), "search-benchmarks.json");
  if (!fs.existsSync(benchmarksPath)) {
    console.error(`Error: benchmarks file not found at ${benchmarksPath}`);
    process.exit(1);
  }

  const benchmarks: BenchmarkCase[] = JSON.parse(
    fs.readFileSync(benchmarksPath, "utf8")
  );

  const queries = benchmarks.map((b) => b.query);
  const results = await evaluateSearchQueries(
    queries,
    { userId },
    "hybrid"
  );

  const resultsByQuery = new Map<string, typeof results>();
  for (const r of results) {
    const existing = resultsByQuery.get(r.query);
    if (existing) {
      existing.push(r);
    } else {
      resultsByQuery.set(r.query, [r]);
    }
  }

  let passedCount = 0;
  let failedCount = 0;

  for (const b of benchmarks) {
    const queryResults = resultsByQuery.get(b.query) || [];
    const resultsCount = queryResults[0]?.results_count ?? 0;
    const titles = queryResults
      .map((r) => r.title)
      .filter((t) => t !== "");

    let passMustContain = true;
    let mustContainReason = "";
    if (b.mustContain && b.mustContain.length > 0) {
      const found = b.mustContain.some((expected) =>
        titles.some((title) =>
          title.toLowerCase().includes(expected.toLowerCase())
        )
      );
      if (!found) {
        passMustContain = false;
        mustContainReason = `Expected title to contain one of [${b.mustContain.map((s) => `"${s}"`).join(", ")}], but got [${titles.map((t) => `"${t}"`).join(", ")}]`;
      }
    }

    let passMinResults = true;
    let minResultsReason = "";
    if (b.minResults !== undefined) {
      if (resultsCount < b.minResults) {
        passMinResults = false;
        minResultsReason = `Result count ${resultsCount} < minResults ${b.minResults}`;
      }
    }

    let passMaxResults = true;
    let maxResultsReason = "";
    if (b.maxResults !== undefined) {
      if (resultsCount > b.maxResults) {
        passMaxResults = false;
        maxResultsReason = `Result count ${resultsCount} > maxResults ${b.maxResults}`;
      }
    }

    const passed = passMustContain && passMinResults && passMaxResults;
    if (passed) {
      console.log(`PASS ${b.query}`);
      passedCount++;
    } else {
      const reasons = [mustContainReason, minResultsReason, maxResultsReason]
        .filter(Boolean)
        .join("; ");
      console.log(`FAIL ${b.query} - Reason: ${reasons}`);
      failedCount++;
    }
  }

  console.log(`\nPassed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error("Benchmark runner failed:", error);
  process.exit(1);
});
