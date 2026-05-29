import { redisConnection } from "../../src/lib/redis/connection";

async function testRedis() {
  try {
    await redisConnection.ping();

    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection failed");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testRedis();