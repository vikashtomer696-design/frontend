const { Router } = require('express');
const { listLogsController } = require('../controllers/logs/listLogsController');

const logRoutes = Router();

logRoutes.get('/executions/:executionId/logs', listLogsController);

module.exports = { logRoutes };
