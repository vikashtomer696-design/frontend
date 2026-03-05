const { enqueueWorkflowExecution } = require('../../queue/workflowQueue');

async function handleExternalWebhook(req, res, next) {
  try {
    const job = await enqueueWorkflowExecution({
      workflowId: req.params.workflowId,
      trigger: {
        method: req.method,
        path: req.params.path,
        body: req.body,
        headers: req.headers,
        query: req.query
      },
      input: req.body || {}
    });
    res.status(202).json({ accepted: true, jobId: job.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleExternalWebhook };
