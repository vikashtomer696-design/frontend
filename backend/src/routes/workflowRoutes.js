import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.js';

const workflowDefinitionSchema = Joi.object({
  startNodeId: Joi.string().required(),
  nodes: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().required(),
      name: Joi.string().required(),
      parameters: Joi.object().required()
    })
  ).required(),
  connections: Joi.array().items(
    Joi.object({
      source: Joi.string().required(),
      target: Joi.string().required()
    })
  ).required()
});

const createWorkflowSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  definition: workflowDefinitionSchema.required()
});

const updateWorkflowSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid('draft', 'active', 'disabled'),
  definition: workflowDefinitionSchema
});

export function workflowRoutes(controller) {
  const router = Router();

  router.post('/workflows', validate(createWorkflowSchema), controller.createWorkflow);
  router.put('/workflows/:workflowId', validate(updateWorkflowSchema), controller.updateWorkflow);
  router.post('/workflows/:workflowId/execute', controller.executeWorkflow);
  router.get('/workflows/:workflowId/executions', controller.executionHistory);
  router.get('/executions/:executionId/logs', controller.logs);
  router.post('/webhooks/:workflowId', controller.triggerWebhook);

  return router;
}
