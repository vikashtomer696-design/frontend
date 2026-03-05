const axios = require('axios');
const BaseNode = require('../../core/BaseNode');

class HttpRequestNode extends BaseNode {
  constructor() {
    super('httpRequest');
  }

  async execute(context, params) {
    const response = await axios({
      method: params.method || 'GET',
      url: params.url,
      headers: params.headers || {},
      data: params.body || null,
      timeout: params.timeoutMs || 10000
    });

    return { status: response.status, data: response.data };
  }
}

module.exports = HttpRequestNode;
