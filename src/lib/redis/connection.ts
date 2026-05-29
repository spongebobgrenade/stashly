import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import IORedis from "ioredis";

console.log("REDIS PORT:", process.env.UPSTASH_REDIS_PORT);

export const redisConnection = new IORedis({
  host: process.env.UPSTASH_REDIS_HOST,
  port: Number(process.env.UPSTASH_REDIS_PORT),
  password: process.env.UPSTASH_REDIS_PASSWORD,

  tls: {},
  
  maxRetriesPerRequest: null,
});