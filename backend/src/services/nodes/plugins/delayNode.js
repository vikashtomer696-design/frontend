import { BaseNode } from '../baseNode.js';

export class DelayNode extends BaseNode {
  constructor() {
    super('delay');
  }

  async execute({ node }) {
    const ms = Number(node.parameters.ms || 1000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    return { delayedMs: ms };
  }
}
