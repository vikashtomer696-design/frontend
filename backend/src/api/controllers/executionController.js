const executionService = require('../../services/executionService');

async function getExecutionById(req, res, next) {
  try {
    const execution = await executionService.getExecutionById(req.params.id);
    if (!execution) return res.status(404).json({ error: 'Execution not found' });
    res.json(execution);
  } catch (error) {
    next(error);
  }
}

async function listExecutions(req, res, next) {
  try {
    const data = await executionService.listExecutions(req.query.workflowId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getExecutionById, listExecutions };
