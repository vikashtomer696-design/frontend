import { Request, Response } from 'express';
import { ExecutionService } from '../services/executionService';

export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  executeWorkflow = async (req: Request, res: Response) => {
    const result = await this.executionService.enqueue({
      workflowId: req.params.workflowId,
      triggerSource: 'api',
      input: req.body?.input ?? {}
    });
    res.status(202).json(result);
  };

  listHistory = async (req: Request, res: Response) => {
    const history = await this.executionService.listHistory(req.params.workflowId);
    res.json(history);
  };

  getLogs = async (req: Request, res: Response) => {
    const logs = await this.executionService.getLogs(req.params.executionId);
    res.json(logs);
  };
}
