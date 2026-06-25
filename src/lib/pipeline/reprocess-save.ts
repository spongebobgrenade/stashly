import { getMemoryProcessingQueue } from "@/lib/redis/queues";

export async function reprocessSave(
  memoryId: string,
  url: string,
  userId: string
): Promise<void> {
  await getMemoryProcessingQueue().add(
    "process-memory",
    {
      memoryId,
      url,
      userId,
    },
    {
      jobId: memoryId,
      removeOnComplete: true,
      removeOnFail: 100,
    }
  );
}
