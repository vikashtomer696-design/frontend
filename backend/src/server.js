const express = require('express');
const routes = require('./api/routes');
const { errorHandler } = require('./api/middlewares/errorHandler');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1', routes);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Automation API listening on :${port}`);
});
