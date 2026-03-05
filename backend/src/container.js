import { ExecutionEngine } from './services/executionEngine.js';
import { CredentialRepository } from './services/repositories/credentialRepository.js';
import { ExecutionRepository } from './services/repositories/executionRepository.js';
import { LogRepository } from './services/repositories/logRepository.js';
import { WorkflowRepository } from './services/repositories/workflowRepository.js';
import { NodeRegistry } from './services/nodes/nodeRegistry.js';
import { CredentialService } from './services/credentialService.js';
import { WorkflowService } from './services/workflowService.js';
import { WorkflowController } from './controllers/workflowController.js';
import { executionQueue } from './queue/queue.js';

export function buildContainer() {
  const workflowRepository = new WorkflowRepository();
  const executionRepository = new ExecutionRepository();
  const logRepository = new LogRepository();
  const credentialRepository = new CredentialRepository();

  const nodeRegistry = new NodeRegistry();

  const workflowService = new WorkflowService({
    workflowRepository,
    executionRepository,
    executionQueue
  });

  const credentialService = new CredentialService({ credentialRepository });

  const executionEngine = new ExecutionEngine({
    nodeRegistry,
    executionRepository,
    logRepository
  });

  const workflowController = new WorkflowController({
    workflowService,
    workflowRepository,
    executionRepository,
    logRepository
  });

  return {
    executionEngine,
    workflowRepository,
    workflowController,
    credentialService
  };
}
