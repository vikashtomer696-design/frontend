import { NodePlugin } from './nodes/base/nodePlugin';
import { DelayNode } from './nodes/plugins/delayNode';
import { HttpRequestNode } from './nodes/plugins/httpRequestNode';
import { IfConditionNode } from './nodes/plugins/ifConditionNode';
import { OpenAiNode } from './nodes/plugins/openAiNode';
import { TelegramSendMessageNode } from './nodes/plugins/telegramSendMessageNode';
import { WebhookTriggerNode } from './nodes/plugins/webhookTriggerNode';

export class NodeRegistry {
  private readonly plugins = new Map<string, NodePlugin>();

  constructor() {
    this.register(new WebhookTriggerNode());
    this.register(new HttpRequestNode());
    this.register(new TelegramSendMessageNode());
    this.register(new OpenAiNode());
    this.register(new DelayNode());
    this.register(new IfConditionNode());
  }

  register(plugin: NodePlugin) {
    this.plugins.set(plugin.type, plugin);
  }

  get(type: string): NodePlugin {
    const plugin = this.plugins.get(type);
    if (!plugin) throw new Error(`Node plugin not found for type: ${type}`);
    return plugin;
  }
}
