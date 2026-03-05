const OpenAI = require('openai');
const BaseNode = require('../../core/BaseNode');
const env = require('../../../config/env');

class OpenAiNode extends BaseNode {
  constructor() {
    super('openAi');
  }

  async execute(context, params) {
    const client = new OpenAI({ apiKey: context.credentials.openAiApiKey });
    const result = await client.chat.completions.create({
      model: params.model || env.defaultOpenAiModel,
      messages: params.messages
    });
    return result.choices[0].message;
  }
}

module.exports = OpenAiNode;
