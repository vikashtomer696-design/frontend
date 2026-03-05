const BaseNode = require('../baseNode');
const { requestJson } = require('../../utils/httpClient');

class OpenAiApiNode extends BaseNode {
  async execute(context) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    const { model = 'gpt-4o-mini', prompt } = this.nodeDefinition.config;

    const response = await requestJson('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: prompt || context.data?.prompt || 'Generate automation response',
      }),
    });

    return {
      ...context.data,
      openai: response,
      message: response?.output?.[0]?.content?.[0]?.text || null,
    };
  }
}

module.exports = OpenAiApiNode;
