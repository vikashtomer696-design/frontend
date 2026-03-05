const BaseNode = require('../baseNode');
const { requestJson } = require('../../utils/httpClient');

class HttpRequestNode extends BaseNode {
  async execute(context) {
    const { url, method = 'GET', headers = {}, body } = this.nodeDefinition.config;

    const result = await requestJson(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return { ...context.data, httpResponse: result };
  }
}

module.exports = HttpRequestNode;
