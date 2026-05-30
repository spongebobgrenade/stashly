import { Queue } from "bullmq";
import IORedis from "ioredis";

let queueConnection: IORedis | null = null;

function getQueueConnection() {
  if (queueConnection) {
    return queueConnection;
  }

  queueConnection = new IORedis({
    host: process.env.UPSTASH_REDIS_HOST,
    port: Number(process.env.UPSTASH_REDIS_PORT),
    password: process.env.UPSTASH_REDIS_PASSWORD,
    tls: {},
    maxRetriesPerRequest: null,
  });

  return queueConnection;
}

export function getMemoryProcessingQueue() {
  return new Queue("memory-processing", {
    connection: getQueueConnection() as never,
  });
}

export function getEmbeddingProcessingQueue() {
  return new Queue("embedding-processing", {
    connection: getQueueConnection() as never,
  });
}