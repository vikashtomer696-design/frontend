export class WorkflowController {
  constructor({ workflowService, workflowRepository, executionRepository, logRepository }) {
    this.workflowService = workflowService;
    this.workflowRepository = workflowRepository;
    this.executionRepository = executionRepository;
    this.logRepository = logRepository;
  }

  createWorkflow = async (req, res) => {
    const workflow = await this.workflowService.createWorkflow(req.body);
    res.status(201).json(workflow);
  };

  updateWorkflow = async (req, res) => {
    const workflow = await this.workflowService.updateWorkflow(req.params.workflowId, req.body);
    res.json(workflow);
  };

  executeWorkflow = async (req, res) => {
    const queued = await this.workflowService.enqueueExecution({
      workflowId: req.params.workflowId,
      input: req.body.input,
      trigger: 'manual'
    });
    res.status(202).json(queued);
  };

  executionHistory = async (req, res) => {
    const items = await this.executionRepository.findManyByField('workflowId', '==', req.params.workflowId);
    res.json(items);
  };

  logs = async (req, res) => {
    const logs = await this.logRepository.findManyByField('executionId', '==', req.params.executionId);
    res.json(logs);
  };

  triggerWebhook = async (req, res) => {
    const { workflowId } = req.params;
    const queued = await this.workflowService.enqueueExecution({
      workflowId,
      input: req.body,
      trigger: 'webhook'
    });

    res.status(202).json({
      message: 'Workflow triggered',
      ...queued
    });
  };
}
