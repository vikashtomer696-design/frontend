import { Router } from 'express';
import { CredentialController } from '../controllers/credentialController';
import { ExecutionController } from '../controllers/executionController';
import { WebhookController } from '../controllers/webhookController';
import { WorkflowController } from '../controllers/workflowController';

interface Controllers {
  workflowController: WorkflowController;
  executionController: ExecutionController;
  webhookController: WebhookController;
  credentialController: CredentialController;
}

export function createRoutes(controllers: Controllers) {
  const router = Router();

  router.post('/workflows', controllers.workflowController.create);
  router.put('/workflows/:id', controllers.workflowController.update);
  router.post('/workflows/:workflowId/execute', controllers.executionController.executeWorkflow);
  router.get('/workflows/:workflowId/executions', controllers.executionController.listHistory);
  router.get('/executions/:executionId/logs', controllers.executionController.getLogs);
  router.post('/credentials', controllers.credentialController.create);
  router.post('/webhooks/:path', controllers.webhookController.trigger);

  return router;
}
