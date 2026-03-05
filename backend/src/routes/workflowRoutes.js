const { Router } = require('express');
const { createWorkflowController } = require('../controllers/workflows/createWorkflowController');
const { updateWorkflowController } = require('../controllers/workflows/updateWorkflowController');
const { executeWorkflowController } = require('../controllers/executions/executeWorkflowController');
const { listExecutionsController } = require('../controllers/executions/listExecutionsController');

const workflowRoutes = Router();

workflowRoutes.post('/', createWorkflowController);
workflowRoutes.put('/:workflowId', updateWorkflowController);
workflowRoutes.post('/:workflowId/execute', executeWorkflowController);
workflowRoutes.get('/:workflowId/executions', listExecutionsController);

module.exports = { workflowRoutes };
