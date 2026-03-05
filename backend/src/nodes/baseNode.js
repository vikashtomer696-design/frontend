class BaseNode {
  constructor(nodeDefinition) {
    this.nodeDefinition = nodeDefinition;
  }

  async execute(_context) {
    throw new Error(`Node type ${this.nodeDefinition.type} did not implement execute()`);
  }
}

module.exports = BaseNode;
