import { Job } from 'bullmq';
import { v4 as uuid } from 'uuid';
import { ExecutionEngine } from '../engine/executionEngine';
import { createExecutionWorker, executionQueue } from '../queue/executionQueue';
import { ExecutionRepository } from '../repositories/executionRepository';
import { WorkflowRepository } from '../repositories/workflowRepository';
import { logger } from '../utils/logger';

interface EnqueuePayload {
  workflowId: string;
  triggerSource: 'api' | 'webhook' | 'manual';
  input: Record<string, unknown>;
}

export class ExecutionService {
  constructor(
    private readonly executionRepository: ExecutionRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly executionEngine: ExecutionEngine
  ) {}

  startWorker() {
    createExecutionWorker(async (job: Job<EnqueuePayload>) => this.process(job));
  }

  async enqueue(payload: EnqueuePayload) {
    const executionId = uuid();
    await this.executionRepository.create({
      id: executionId,
      workflowId: payload.workflowId,
      status: 'queued',
      triggerSource: payload.triggerSource,
      input: payload.input,
      logs: [],
      createdAt: new Date().toISOString()
    });

    await executionQueue.add('execute', { ...payload, executionId });
    return { executionId };
  }

  async process(job: Job<EnqueuePayload & { executionId: string }>) {
    const { workflowId, input, executionId } = job.data;
    const workflow = await this.workflowRepository.findById(workflowId);

    if (!workflow) {
      await this.executionRepository.update(executionId, {
        status: 'failed',
        finishedAt: new Date().toISOString(),
        logs: [
          {
            nodeId: 'system',
            nodeName: 'validator',
            status: 'failed',
            error: 'Workflow not found',
            timestamp: new Date().toISOString()
          }
        ]
      });
      return;
    }

    await this.executionRepository.update(executionId, {
      status: 'running',
      startedAt: new Date().toISOString()
    });

    try {
      const result = await this.executionEngine.executeWorkflow(workflow, input);
      await this.executionRepository.update(executionId, {
        status: 'success',
        output: result.output,
        logs: result.logs,
        finishedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Execution failed', { error, workflowId, executionId });
      await this.executionRepository.update(executionId, {
        status: 'failed',
        finishedAt: new Date().toISOString()
      });
    }
  }

  async listHistory(workflowId: string) {
    return this.executionRepository.listByWorkflow(workflowId);
  }

  async getLogs(executionId: string) {
    const execution = await this.executionRepository.findById(executionId);
    return execution?.logs ?? [];
  }
}
