require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { workflowRoutes } = require('./routes/workflowRoutes');
const { logRoutes } = require('./routes/logRoutes');
const { webhookRoutes } = require('./routes/webhookRoutes');
const { mockAuth } = require('./middleware/mockAuth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/workflows', mockAuth, workflowRoutes);
app.use('/api', mockAuth, logRoutes);
app.use('/webhooks', webhookRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Automation backend listening on port ${port}`);
});
