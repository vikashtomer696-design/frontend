import TelegramBot from 'node-telegram-bot-api';
import { env } from '../../../config/env';
import { NodePlugin } from '../base/nodePlugin';

export class TelegramSendMessageNode implements NodePlugin {
  type = 'telegramSendMessage';

  async execute({ config, getCredential }: Parameters<NodePlugin['execute']>[0]) {
    const credential = await getCredential(config.credentialsRef as string | undefined);
    const token = String(credential?.botToken ?? env.TELEGRAM_BOT_TOKEN ?? '');
    if (!token) {
      throw new Error('Telegram token not configured');
    }

    const bot = new TelegramBot(token);
    const result = await bot.sendMessage(String(config.chatId), String(config.message));

    return { messageId: result.message_id };
  }
}
