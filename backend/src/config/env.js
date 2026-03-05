require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT || 6379),
  encryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY,
  defaultOpenAiModel: process.env.DEFAULT_OPENAI_MODEL || 'gpt-4o-mini'
};
