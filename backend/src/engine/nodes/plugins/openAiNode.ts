import OpenAI from 'openai';
import { env } from '../../../config/env';
import { NodePlugin } from '../base/nodePlugin';

export class OpenAiNode implements NodePlugin {
  type = 'openai';

  async execute({ config, getCredential }: Parameters<NodePlugin['execute']>[0]) {
    const credential = await getCredential(config.credentialsRef as string | undefined);
    const apiKey = String(credential?.apiKey ?? env.OPENAI_API_KEY ?? '');

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: String(config.model ?? 'gpt-4o-mini'),
      messages: [{ role: 'user', content: String(config.prompt ?? '') }]
    });

    return { completion: completion.choices[0]?.message?.content ?? '' };
  }
}
