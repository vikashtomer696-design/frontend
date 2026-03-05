import { Request, Response } from 'express';
import { WorkflowService } from '../services/workflowService';

export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  create = async (req: Request, res: Response) => {
    const workflow = await this.workflowService.create(req.body);
    res.status(201).json(workflow);
  };

  update = async (req: Request, res: Response) => {
    const workflow = await this.workflowService.update(req.params.id, req.body);
    res.json(workflow);
  };
}
