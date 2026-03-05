const express = require('express');
const controller = require('../controllers/logController');

const router = express.Router();
router.get('/', controller.fetchLogs);

module.exports = router;
