const executionService = require('../../services/executionService');

async function fetchLogs(req, res, next) {
  try {
    const logs = await executionService.fetchLogs(req.query.executionId);
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

module.exports = { fetchLogs };
