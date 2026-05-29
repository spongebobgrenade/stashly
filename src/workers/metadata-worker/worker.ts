import path from "path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.worker"),
});

console.log(
  "SUPABASE URL:",
  process.env.SUPABASE_URL
);

import { Worker } from "bullmq";

import IORedis from "ioredis";

import { processMemoryJob } from "./metadata-processor";

const workerConnection = new IORedis({
  host: process.env.UPSTASH_REDIS_HOST,

  port: Number(process.env.UPSTASH_REDIS_PORT),

  password: process.env.UPSTASH_REDIS_PASSWORD,

  tls: {},

  maxRetriesPerRequest: null,
});

const memoryWorker = new Worker(
  "memory-processing",

  async (job) => {
    await processMemoryJob(job.data);
  },

  {
    // TECH_DEBT:
    // BullMQ + ioredis typing incompatibility.
    // Runtime works correctly.
    // Replace with centralized typed Redis/BullMQ factory
    // during infrastructure hardening phase.

    connection: workerConnection as any,
  }
);

console.log("👂 Memory worker listening for jobs...");