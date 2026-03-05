import dotenv from 'dotenv';

dotenv.config();

const required = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'CREDENTIAL_ENCRYPTION_KEY'
];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`Missing env var: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT || 6379),
  redisPassword: process.env.REDIS_PASSWORD || undefined,
  queueName: process.env.QUEUE_NAME || 'workflow-executions',
  encryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN
};
