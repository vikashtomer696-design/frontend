import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { env } from '../config/env.js';

const connection = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  maxRetriesPerRequest: null
});

export const executionQueue = new Queue(env.queueName, { connection });

export function createExecutionWorker(processor) {
  return new Worker(env.queueName, processor, { connection, concurrency: 10 });
}
