const BaseNode = require('../baseNode');

class WebhookTriggerNode extends BaseNode {
  async execute(context) {
    return {
      ...context.input,
      webhook: {
        receivedAt: new Date().toISOString(),
        payload: context.input?.payload || {},
      },
    };
  }
}

module.exports = WebhookTriggerNode;
