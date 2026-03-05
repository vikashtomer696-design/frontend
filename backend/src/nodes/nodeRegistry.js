const WebhookTriggerNode = require('./plugins/webhookTriggerNode');
const HttpRequestNode = require('./plugins/httpRequestNode');
const TelegramSendMessageNode = require('./plugins/telegramSendMessageNode');
const OpenAiApiNode = require('./plugins/openAiApiNode');
const DelayNode = require('./plugins/delayNode');
const IfConditionNode = require('./plugins/ifConditionNode');

const NODE_REGISTRY = {
  webhookTrigger: WebhookTriggerNode,
  httpRequest: HttpRequestNode,
  telegramSendMessage: TelegramSendMessageNode,
  openAiApi: OpenAiApiNode,
  delay: DelayNode,
  ifCondition: IfConditionNode,
};

function createNode(nodeDefinition) {
  const NodeClass = NODE_REGISTRY[nodeDefinition.type];
  if (!NodeClass) {
    throw new Error(`Unknown node type: ${nodeDefinition.type}`);
  }
  return new NodeClass(nodeDefinition);
}

module.exports = { createNode, NODE_REGISTRY };
