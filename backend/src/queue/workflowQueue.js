const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const workflowQueue = new Queue('workflow-executions', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

async function enqueueWorkflowExecution(workflowId, payload = {}) {
  return workflowQueue.add('execute-workflow', { workflowId, payload });
}

module.exports = { workflowQueue, enqueueWorkflowExecution };
