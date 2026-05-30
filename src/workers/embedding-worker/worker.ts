import path from "path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env.worker"
  ),
});

import {
  Worker,
  type Job,
} from "bullmq";

import IORedis from "ioredis";

import { processEmbeddingJob } from "./embedding-processor";

import type {
  ProcessEmbeddingJob,
} from "@/types/jobs";

const workerConnection =
  new IORedis({
    host: process.env
      .UPSTASH_REDIS_HOST,

    port: Number(
      process.env
        .UPSTASH_REDIS_PORT
    ),

    password:
      process.env
        .UPSTASH_REDIS_PASSWORD,

    tls: {},

    maxRetriesPerRequest:
      null,
  });

new Worker(
  "embedding-processing",

  async (
    job: Job<ProcessEmbeddingJob>
  ) => {
    await processEmbeddingJob(
      job.data
    );
  },

  {
    connection:
      workerConnection as never,
  }
);

console.log(
  "🧠 Embedding worker listening for jobs..."
);