import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { Queue } from "bullmq";

import IORedis from "ioredis";

const queueConnection =
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

export const memoryProcessingQueue =
  new Queue(
    "memory-processing",
    {
      connection:
        queueConnection as never,
    }
  );