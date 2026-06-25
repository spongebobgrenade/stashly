import path from "path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env.worker"
  ),
});

console.log(
  "SUPABASE URL:",
  process.env.SUPABASE_URL
);

import {
  Worker,
  type Job,
} from "bullmq";

import IORedis from "ioredis";

import { processMemoryJob } from "./metadata-processor";

import type { ProcessMemoryJob } from "@/types/jobs";

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
  "memory-processing",

  async (
    job: Job<ProcessMemoryJob>
  ) => {
    await processMemoryJob(
      job.data
    );
  },

  {
    connection:
      workerConnection as never,
    lockDuration: 300000,
  }
);

console.log(
  "👂 Memory worker listening for jobs..."
);