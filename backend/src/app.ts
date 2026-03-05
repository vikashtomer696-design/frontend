import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { ExecutionEngine } from './engine/executionEngine';
import { NodeRegistry } from './engine/nodeRegistry';
import { errorHandler } from './middleware/errorHandler';
import { CredentialRepository } from './repositories/credentialRepository';
import { ExecutionRepository } from './repositories/executionRepository';
import { WorkflowRepository } from './repositories/workflowRepository';
import { createRoutes } from './routes';
import { CredentialService } from './services/credentialService';
import { ExecutionService } from './services/executionService';
import { WorkflowService } from './services/workflowService';
import { CredentialController } from './controllers/credentialController';
import { ExecutionController } from './controllers/executionController';
import { WebhookController } from './controllers/webhookController';
import { WorkflowController } from './controllers/workflowController';

export function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  const workflowRepository = new WorkflowRepository();
  const executionRepository = new ExecutionRepository();
  const credentialRepository = new CredentialRepository();

  const workflowService = new WorkflowService(workflowRepository);
  const executionEngine = new ExecutionEngine(new NodeRegistry(), credentialRepository);
  const executionService = new ExecutionService(executionRepository, workflowRepository, executionEngine);
  const credentialService = new CredentialService(credentialRepository);

  const workflowController = new WorkflowController(workflowService);
  const executionController = new ExecutionController(executionService);
  const webhookController = new WebhookController(workflowService, executionService);
  const credentialController = new CredentialController(credentialService);

  app.use('/api/v1',
    createRoutes({ workflowController, executionController, webhookController, credentialController })
  );

  app.use(errorHandler);

  executionService.startWorker();

  return app;
}
