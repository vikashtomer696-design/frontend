const IORedis = require('ioredis');
const env = require('../config/env');

const connection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null
});

module.exports = connection;
