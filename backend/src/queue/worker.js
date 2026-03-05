require('dotenv').config();
const { Worker } = require('bullmq');
const connection = require('./connection');
const { runWorkflow } = require('../engine/executionEngine');

const worker = new Worker(
  'workflow-execution',
  async (job) => runWorkflow(job.data),
  { connection, concurrency: 15 }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job && job.id} failed:`, err.message);
});
