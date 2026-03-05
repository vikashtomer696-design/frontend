const BaseNode = require('../../core/BaseNode');

class IfConditionNode extends BaseNode {
  constructor() {
    super('ifCondition');
  }

  async execute(context, params) {
    const left = params.left;
    const right = params.right;
    const op = params.operator || '===';
    const truthy = op === '===' ? left === right : left !== right;
    return {
      branch: truthy ? 'true' : 'false',
      result: truthy
    };
  }
}

module.exports = IfConditionNode;
