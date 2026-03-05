import { v4 as uuid } from 'uuid';

export class WorkflowService {
  constructor({ workflowRepository, executionRepository, executionQueue }) {
    this.workflowRepository = workflowRepository;
    this.executionRepository = executionRepository;
    this.executionQueue = executionQueue;
  }

  async createWorkflow({ userId, name, definition }) {
    const id = uuid();
    const now = new Date().toISOString();
    return this.workflowRepository.create(id, {
      userId,
      name,
      status: 'draft',
      definition,
      startNodeId: definition.startNodeId,
      createdAt: now,
      updatedAt: now
    });
  }

  async updateWorkflow(id, updates) {
    return this.workflowRepository.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async enqueueExecution({ workflowId, input = {}, trigger = 'manual' }) {
    const executionId = uuid();
    await this.executionRepository.create(executionId, {
      workflowId,
      trigger,
      input,
      status: 'queued',
      createdAt: new Date().toISOString()
    });

    await this.executionQueue.add('execute-workflow', { executionId, workflowId, input, trigger });
    return { executionId, status: 'queued' };
  }
}
