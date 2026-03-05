const workflowService = require('../../services/workflowService');
const executionService = require('../../services/executionService');
const { enqueueWorkflowExecution } = require('../../queue/workflowQueue');

async function createWorkflow(req, res, next) {
  try {
    const workflow = await workflowService.createWorkflow(req.body);
    res.status(201).json(workflow);
  } catch (error) {
    next(error);
  }
}

async function updateWorkflow(req, res, next) {
  try {
    const workflow = await workflowService.updateWorkflow(req.params.id, req.body);
    res.json(workflow);
  } catch (error) {
    next(error);
  }
}

async function executeWorkflow(req, res, next) {
  try {
    const job = await enqueueWorkflowExecution({
      workflowId: req.params.id,
      trigger: { method: 'MANUAL' },
      input: req.body.input || {}
    });
    res.status(202).json({ queued: true, jobId: job.id });
  } catch (error) {
    next(error);
  }
}

async function getWorkflowExecutions(req, res, next) {
  try {
    const data = await executionService.listExecutions(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createWorkflow,
  updateWorkflow,
  executeWorkflow,
  getWorkflowExecutions
};
