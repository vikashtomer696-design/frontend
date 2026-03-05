import { Request, Response } from 'express';
import { ExecutionService } from '../services/executionService';
import { WorkflowService } from '../services/workflowService';

export class WebhookController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly executionService: ExecutionService
  ) {}

  trigger = async (req: Request, res: Response) => {
    const workflow = await this.workflowService.findByWebhookPath(req.params.path);
    if (!workflow) {
      return res.status(404).json({ message: 'Webhook workflow not found' });
    }

    const result = await this.executionService.enqueue({
      workflowId: workflow.id,
      triggerSource: 'webhook',
      input: {
        body: req.body,
        headers: req.headers,
        query: req.query
      }
    });

    return res.status(202).json(result);
  };
}
