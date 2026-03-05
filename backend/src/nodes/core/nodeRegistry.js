const WebhookTriggerNode = require('../plugins/webhookTrigger/WebhookTriggerNode');
const HttpRequestNode = require('../plugins/httpRequest/HttpRequestNode');
const TelegramSendMessageNode = require('../plugins/telegramSendMessage/TelegramSendMessageNode');
const OpenAiNode = require('../plugins/openaiApi/OpenAiNode');
const DelayNode = require('../plugins/delay/DelayNode');
const IfConditionNode = require('../plugins/ifCondition/IfConditionNode');

const registry = new Map([
  ['webhookTrigger', new WebhookTriggerNode()],
  ['httpRequest', new HttpRequestNode()],
  ['telegramSendMessage', new TelegramSendMessageNode()],
  ['openAi', new OpenAiNode()],
  ['delay', new DelayNode()],
  ['ifCondition', new IfConditionNode()]
]);

function registerNode(type, nodeInstance) {
  registry.set(type, nodeInstance);
}

function getNode(type) {
  const node = registry.get(type);
  if (!node) throw new Error(`Unsupported node type: ${type}`);
  return node;
}

module.exports = { registerNode, getNode };
