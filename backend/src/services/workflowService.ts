import { v4 as uuid } from 'uuid';
import { WorkflowRepository } from '../repositories/workflowRepository';
import { WorkflowDefinition } from '../types/workflow';

export class WorkflowService {
  constructor(private readonly workflowRepository: WorkflowRepository) {}

  async create(payload: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>) {
    const workflow: WorkflowDefinition = {
      ...payload,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.workflowRepository.create(workflow);
    return workflow;
  }

  async update(id: string, payload: Partial<WorkflowDefinition>) {
    await this.workflowRepository.update(id, payload);
    return this.workflowRepository.findById(id);
  }

  async findById(id: string) {
    return this.workflowRepository.findById(id);
  }

  async findByWebhookPath(path: string) {
    return this.workflowRepository.findByWebhookPath(path);
  }
}
