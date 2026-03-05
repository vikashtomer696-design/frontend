const express = require('express');
const controller = require('../controllers/workflowController');

const router = express.Router();
router.post('/', controller.createWorkflow);
router.put('/:id', controller.updateWorkflow);
router.post('/:id/execute', controller.executeWorkflow);
router.get('/:id/executions', controller.getWorkflowExecutions);

module.exports = router;
