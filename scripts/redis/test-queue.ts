import { memoryProcessingQueue } from "../../src/lib/redis/queues";

async function testQueue() {
  try {
    const job = await memoryProcessingQueue.add(
      "process-memory",
      {
        memoryId: "test-memory-1",
        url: "https://youtube.com/watch?v=test",
        userId: "user-123",
      }
    );

    console.log("✅ Job added successfully");
    console.log("Job ID:", job.id);
  } catch (error) {
    console.error("❌ Queue test failed");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testQueue();