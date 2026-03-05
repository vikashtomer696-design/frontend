const express = require('express');
const controller = require('../controllers/executionController');

const router = express.Router();
router.get('/:id', controller.getExecutionById);
router.get('/', controller.listExecutions);

module.exports = router;
