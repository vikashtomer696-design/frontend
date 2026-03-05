const BaseNode = require('../../core/BaseNode');

class WebhookTriggerNode extends BaseNode {
  constructor() {
    super('webhookTrigger');
  }

  async execute(context, params) {
    return {
      triggered: true,
      method: context.trigger?.method || 'MANUAL',
      body: context.trigger?.body || null,
      path: params.path
    };
  }
}

module.exports = WebhookTriggerNode;
