require('dotenv').config();
const { Worker } = require('bullmq');
const { connection } = require('../config/redis');
const { getWorkflowById } = require('../services/workflowService');
const { executeWorkflow } = require('../engine/workflowExecutor');

const worker = new Worker(
  'workflow-executions',
  async (job) => {
    const { workflowId, payload } = job.data;
    const workflow = await getWorkflowById(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    return executeWorkflow(workflow, payload);
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Workflow execution job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
  console.error(`Workflow execution job ${job?.id} failed`, error);
});
