const { Queue } = require('bullmq');
const connection = require('./connection');

const workflowQueue = new Queue('workflow-execution', { connection });

async function enqueueWorkflowExecution(payload) {
  return workflowQueue.add('execute', payload, {
    attempts: 3,
    removeOnComplete: 1000,
    backoff: { type: 'exponential', delay: 1000 }
  });
}

module.exports = { workflowQueue, enqueueWorkflowExecution };
