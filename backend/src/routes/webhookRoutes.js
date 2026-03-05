const { Router } = require('express');
const { webhookTriggerController } = require('../controllers/workflows/webhookTriggerController');

const webhookRoutes = Router();

webhookRoutes.post('/:workflowId/:key', webhookTriggerController);

module.exports = { webhookRoutes };
