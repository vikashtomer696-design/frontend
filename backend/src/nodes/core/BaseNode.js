class BaseNode {
  constructor(type) {
    this.type = type;
  }

  // eslint-disable-next-line no-unused-vars
  async execute(context, params) {
    throw new Error(`Execute not implemented for node type: ${this.type}`);
  }
}

module.exports = BaseNode;
