import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  evaluateSearchQueries,
} from "@/lib/retrieval/evaluate-search";

const OUTPUT_FILE_NAME =
  "search-evaluation.json";

const testQueries = [
  "diet",
  "protein",
  "muscle",
  "home decor",
  "swarmclaw",
  "rick astley",
  "youtube shorts",
  "blog",
  "stripe",
  "audience",
  "quantum physics banana spaceship",
] as const;

type QueryEvaluationResult =
  Awaited<
    ReturnType<
      typeof evaluateSearchQueries
    >
  >[number];

function printResults(
  results: QueryEvaluationResult[]
): void {
  const groupedResults =
    new Map<
      string,
      QueryEvaluationResult[]
    >();

  for (const result of results) {
    const existing =
      groupedResults.get(
        result.query
      );

    if (existing) {
      existing.push(result);
    } else {
      groupedResults.set(
        result.query,
        [result]
      );
    }
  }

  for (const [
    query,
    queryResults,
  ] of groupedResults) {
    const resultsCount =
      queryResults[0]
        ?.results_count ?? 0;

    console.log(
      `Query: ${query}`
    );
    console.log(
      `Results: ${resultsCount}`
    );
    console.log("");

    if (
      queryResults.length ===
        0 ||
      (queryResults.length ===
        1 &&
        queryResults[0]
          ?.results_count ===
          0)
    ) {
      console.log(
        "No results"
      );
    } else {
      queryResults.forEach(
        (
          result,
          index
        ) => {
          console.log(
            `${index + 1}. ${result.title}`
          );
          console.log(
            `   similarity: ${
              result.similarity ===
              null
                ? "n/a"
                : result.similarity.toFixed(
                    2
                  )
            }`
          );
          console.log(
            `   semanticScore: ${
              result.semanticScore ===
              null
                ? "n/a"
                : result.semanticScore.toFixed(
                    2
                  )
            }`
          );
          console.log(
            `   keywordScore: ${
              result.keywordScore ===
              null
                ? "n/a"
                : result.keywordScore.toFixed(
                    2
                  )
            }`
          );
          console.log(
            `   finalScore: ${
              result.finalScore ===
              null
                ? "n/a"
                : result.finalScore.toFixed(
                    2
                  )
            }`
          );
          console.log(
            `   duplicateCount: ${
              result.duplicateCount ===
              null
                ? "n/a"
                : result.duplicateCount
            }`
          );
        }
      );
    }

    console.log("");
    console.log(
      "--------------------------------"
    );
    console.log("");
  }
}

async function saveResults(
  results: QueryEvaluationResult[]
): Promise<string> {
  const outputPath = path.resolve(
    process.cwd(),
    OUTPUT_FILE_NAME
  );

  await writeFile(
    outputPath,
    JSON.stringify(
      results,
      null,
      2
    ) + "\n",
    "utf8"
  );

  return outputPath;
}

async function main() {
  const userId =
    process.env
      .SEARCH_EVAL_USER_ID ??
    process.argv[2];

  if (!userId) {
    throw new Error(
      "Missing evaluation userId. Provide SEARCH_EVAL_USER_ID or pass a userId as the first argument."
    );
  }

  const results:
    QueryEvaluationResult[] =
      await evaluateSearchQueries(
        testQueries,
        {
          userId,
        },
        "hybrid"
      );

  printResults(results);

  const outputPath =
    await saveResults(results);

  console.log(
    `Saved evaluation results to ${outputPath}`
  );
}

main().catch((error: unknown) => {
  console.error(
    "Search evaluation failed."
  );

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});
