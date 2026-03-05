import { Request, Response } from 'express';
import { CredentialService } from '../services/credentialService';

export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  create = async (req: Request, res: Response) => {
    const { ownerId, provider, payload } = req.body;
    const result = await this.credentialService.create(ownerId, provider, payload);
    res.status(201).json(result);
  };
}
