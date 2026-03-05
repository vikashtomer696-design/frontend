const express = require('express');
const controller = require('../controllers/webhookController');

const router = express.Router();
router.all('/:workflowId/:path', controller.handleExternalWebhook);

module.exports = router;
