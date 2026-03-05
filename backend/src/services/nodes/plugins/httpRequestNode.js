import { BaseNode } from '../baseNode.js';

export class HttpRequestNode extends BaseNode {
  constructor() {
    super('httpRequest');
  }

  async execute({ node }) {
    const { url, method = 'GET', headers = {}, body } = node.parameters;
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json().catch(() => null);

    return { status: response.status, data };
  }
}
