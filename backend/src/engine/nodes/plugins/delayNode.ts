import { NodePlugin } from '../base/nodePlugin';

export class DelayNode implements NodePlugin {
  type = 'delay';

  async execute({ config }: Parameters<NodePlugin['execute']>[0]) {
    const ms = Number(config.ms ?? 1000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    return { delayedMs: ms };
  }
}
