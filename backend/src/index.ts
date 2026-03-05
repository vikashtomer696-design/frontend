import { buildApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = buildApp();
app.listen(Number(env.PORT), () => {
  logger.info(`Automation backend running on port ${env.PORT}`);
});
