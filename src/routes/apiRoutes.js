const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { apiLimiter, sanitizeInput } = require('../middlewares/security');

// Apply rate limiting and sanitization to all API routes
router.use(apiLimiter);
router.use(sanitizeInput);

// Define endpoints
router.post('/chat', apiController.handleChat);
router.post('/translate', apiController.handleTranslate);
router.post('/analyze', apiController.handleAnalyze);

module.exports = router;
