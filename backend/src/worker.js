import { createExecutionWorker } from './queue/queue.js';
import { buildContainer } from './container.js';

const { executionEngine, workflowRepository } = buildContainer();

createExecutionWorker(async (job) => {
  const { executionId, workflowId, input } = job.data;
  const workflow = await workflowRepository.findById(workflowId);
  if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

  return executionEngine.run({
    executionId,
    workflow: { id: workflow.id, ...workflow.definition },
    input
  });
});
