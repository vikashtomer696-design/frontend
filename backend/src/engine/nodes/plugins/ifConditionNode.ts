import { NodePlugin } from '../base/nodePlugin';

export class IfConditionNode implements NodePlugin {
  type = 'ifCondition';

  async execute({ config, input }: Parameters<NodePlugin['execute']>[0]) {
    const field = String(config.field);
    const equals = config.equals;
    const value = input[field];
    const passed = value === equals;

    return { passed, branch: passed ? 'true' : 'false' };
  }
}
