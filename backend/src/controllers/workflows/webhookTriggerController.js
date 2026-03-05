const { db } = require('../../config/firebase');
const { enqueueWorkflowExecution } = require('../../queue/workflowQueue');

async function webhookTriggerController(req, res, next) {
  try {
    const { workflowId, key } = req.params;
    const workflowDoc = await db.collection('workflows').doc(workflowId).get();

    if (!workflowDoc.exists) {
      return res.status(404).json({ error: 'Workflow not found.' });
    }

    const workflow = workflowDoc.data();
    if (workflow.webhookKey !== key) {
      return res.status(401).json({ error: 'Invalid webhook key.' });
    }

    const job = await enqueueWorkflowExecution(workflowId, { payload: req.body, headers: req.headers });
    return res.status(202).json({ accepted: true, jobId: job.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { webhookTriggerController };
