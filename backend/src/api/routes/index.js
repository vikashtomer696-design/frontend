const express = require('express');
const workflowRoutes = require('./workflows');
const executionRoutes = require('./executions');
const logRoutes = require('./logs');
const webhookRoutes = require('./webhooks');

const router = express.Router();
router.use('/workflows', workflowRoutes);
router.use('/executions', executionRoutes);
router.use('/logs', logRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;
