import { createApp } from './app.js';
import { env } from './config/env.js';
import { buildContainer } from './container.js';
import './worker.js';

const { workflowController } = buildContainer();
const app = createApp(workflowController);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Automation platform backend listening on port ${env.port}`);
});
