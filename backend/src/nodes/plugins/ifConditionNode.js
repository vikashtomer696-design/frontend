const BaseNode = require('../baseNode');

class IfConditionNode extends BaseNode {
  async execute(context) {
    const { leftOperand, operator = '==', rightOperand } = this.nodeDefinition.config;

    const left = leftOperand ?? context.data?.value;
    const right = rightOperand;

    const operations = {
      '==': left == right,
      '===': left === right,
      '!=': left != right,
      '>': left > right,
      '<': left < right,
      '>=': left >= right,
      '<=': left <= right,
    };

    const passed = operations[operator] ?? false;
    return { ...context.data, conditionPassed: passed };
  }
}

module.exports = IfConditionNode;
