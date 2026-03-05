import axios from 'axios';
import { NodePlugin } from '../base/nodePlugin';

export class HttpRequestNode implements NodePlugin {
  type = 'httpRequest';

  async execute({ config }: Parameters<NodePlugin['execute']>[0]) {
    const response = await axios.request({
      method: String(config.method ?? 'GET'),
      url: String(config.url),
      data: config.body,
      headers: (config.headers as Record<string, string>) ?? {}
    });

    return { status: response.status, data: response.data };
  }
}
