import { BaseNode } from '../baseNode.js';

export class WebhookTriggerNode extends BaseNode {
  constructor() {
    super('webhookTrigger');
  }

  async execute({ input }) {
    return { triggered: true, payload: input };
  }
}
