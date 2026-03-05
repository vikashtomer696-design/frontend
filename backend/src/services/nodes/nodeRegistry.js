import { DelayNode } from './plugins/delayNode.js';
import { HttpRequestNode } from './plugins/httpRequestNode.js';
import { IfConditionNode } from './plugins/ifConditionNode.js';
import { OpenAiNode } from './plugins/openAiNode.js';
import { TelegramSendMessageNode } from './plugins/telegramSendMessageNode.js';
import { WebhookTriggerNode } from './plugins/webhookTriggerNode.js';

export class NodeRegistry {
  constructor() {
    this.nodes = new Map();
    [
      new WebhookTriggerNode(),
      new HttpRequestNode(),
      new TelegramSendMessageNode(),
      new OpenAiNode(),
      new DelayNode(),
      new IfConditionNode()
    ].forEach((node) => this.register(node));
  }

  register(nodeImplementation) {
    this.nodes.set(nodeImplementation.type, nodeImplementation);
  }

  get(type) {
    const node = this.nodes.get(type);
    if (!node) throw new Error(`Unsupported node type: ${type}`);
    return node;
  }
}
