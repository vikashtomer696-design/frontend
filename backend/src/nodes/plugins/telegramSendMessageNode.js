const BaseNode = require('../baseNode');
const { requestJson } = require('../../utils/httpClient');

class TelegramSendMessageNode extends BaseNode {
  async execute(context) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured.');
    }

    const { chatId, text } = this.nodeDefinition.config;
    const result = await requestJson(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text || context.data?.message || 'Automation message',
      }),
    });

    return { ...context.data, telegram: result };
  }
}

module.exports = TelegramSendMessageNode;
