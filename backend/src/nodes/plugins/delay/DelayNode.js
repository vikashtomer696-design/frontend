const BaseNode = require('../../core/BaseNode');

class DelayNode extends BaseNode {
  constructor() {
    super('delay');
  }

  async execute(context, params) {
    const ms = Number(params.ms || 1000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    return { delayedMs: ms };
  }
}

module.exports = DelayNode;
