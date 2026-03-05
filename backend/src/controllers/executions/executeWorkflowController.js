const { enqueueWorkflowExecution } = require('../../queue/workflowQueue');

async function executeWorkflowController(req, res, next) {
  try {
    const job = await enqueueWorkflowExecution(req.params.workflowId, req.body || {});
    res.status(202).json({ queued: true, jobId: job.id, workflowId: req.params.workflowId });
  } catch (error) {
    next(error);
  }
}

module.exports = { executeWorkflowController };
