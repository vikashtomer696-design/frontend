import { BaseRepository } from './baseRepository.js';

export class WorkflowRepository extends BaseRepository {
  constructor() {
    super('workflows');
  }
}
