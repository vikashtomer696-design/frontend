import { BaseNode } from '../baseNode.js';
import { env } from '../../../config/env.js';

export class OpenAiNode extends BaseNode {
  constructor() {
    super('openAi');
  }

  async execute({ node }) {
    const apiKey = node.parameters.apiKey || env.openAiApiKey;
    const { prompt, model = 'gpt-4o-mini' } = node.parameters;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, input: prompt })
    });

    return response.json();
  }
}
