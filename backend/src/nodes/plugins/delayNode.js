const BaseNode = require('../baseNode');

class DelayNode extends BaseNode {
  async execute(context) {
    const { milliseconds = 1000 } = this.nodeDefinition.config;
    await new Promise((resolve) => setTimeout(resolve, Number(milliseconds)));
    return { ...context.data, delayMs: milliseconds };
  }
}

module.exports = DelayNode;
