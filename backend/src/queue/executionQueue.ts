import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

export const executionQueue = new Queue('workflow-execution', {
  connection: redisConnection
});

export function createExecutionWorker(processor: Parameters<typeof Worker>[1]) {
  return new Worker('workflow-execution', processor, {
    connection: redisConnection,
    concurrency: 10
  });
}
