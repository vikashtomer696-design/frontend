import { BaseNode } from '../baseNode.js';

export class IfConditionNode extends BaseNode {
  constructor() {
    super('ifCondition');
  }

  async execute({ node, previousResult }) {
    const { field, equals } = node.parameters;
    const actual = previousResult?.[field];
    const matched = actual === equals;
    return { matched, actual, expected: equals };
  }
}
