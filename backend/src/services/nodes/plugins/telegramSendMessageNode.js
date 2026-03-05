import { BaseNode } from '../baseNode.js';
import { env } from '../../../config/env.js';

export class TelegramSendMessageNode extends BaseNode {
  constructor() {
    super('telegramSendMessage');
  }

  async execute({ node }) {
    const token = node.parameters.botToken || env.telegramBotToken;
    const { chatId, text } = node.parameters;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    return response.json();
  }
}
