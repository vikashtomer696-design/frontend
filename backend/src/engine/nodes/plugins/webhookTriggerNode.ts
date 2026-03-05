import { NodePlugin } from '../base/nodePlugin';

export class WebhookTriggerNode implements NodePlugin {
  type = 'webhookTrigger';

  async execute() {
    return { triggered: true };
  }
}
