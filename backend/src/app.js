import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { workflowRoutes } from './routes/workflowRoutes.js';

export function createApp(controller) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('combined'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/v1', workflowRoutes(controller));

  app.use((error, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
