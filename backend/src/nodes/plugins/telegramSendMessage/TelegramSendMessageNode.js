const axios = require('axios');
const BaseNode = require('../../core/BaseNode');

class TelegramSendMessageNode extends BaseNode {
  constructor() {
    super('telegramSendMessage');
  }

  async execute(context, params) {
    const token = context.credentials.telegramBotToken;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: params.chatId,
      text: params.message
    });
    return response.data;
  }
}

module.exports = TelegramSendMessageNode;
