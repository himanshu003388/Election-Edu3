const config = require('../config/env');
const cache = require('../services/cacheService');
const gcp = require('../services/googleCloudService');

/**
 * Health Check endpoint to verify server and GCP services status.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getHealth = (req, res) => {
    res.json({
        status: 'ok',
        services: {
            vertexAI: gcp.googleServicesReady,
            translate: gcp.googleServicesReady,
            nlp: gcp.googleServicesReady,
            firestore: gcp.googleServicesReady
        }
    });
};

/**
 * Handles chat interactions using Vertex AI Gemini.
 * Retrieves history, generates response, and saves context to Firestore.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleChat = async (req, res) => {
    const { message, sessionId = 'default-session' } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
    }
    const trimmed = message.trim();
    if (trimmed.length === 0) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    if (trimmed.length > 1000) {
        return res.status(400).json({ error: 'Message is too long. Max 1000 characters.' });
    }

    if (!gcp.googleServicesReady) {
        return res.json({
            reply: 'Demo Mode: Google Cloud credentials not configured. In production, I would answer your election question using Vertex AI Gemini.',
            demo: true
        });
    }

    try {
        // Fetch history for context
        const priorHistory = await gcp.getChatHistory(sessionId);
        
        // Save user message
        await gcp.saveChatMessage(sessionId, 'user', trimmed);

        // Build history payload for Gemini
        const history = [
            {
                role: 'user',
                parts: [{ text: gcp.SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood! I am ElectionEdu AI, ready to help you learn about Indian elections.' }]
            },
            ...priorHistory
        ];

        const chat = gcp.generativeModel.startChat({ history });

        const result = await chat.sendMessage(trimmed);
        const response = result.response;
        const reply = response.candidates[0].content.parts[0].text;

        // Save AI response
        await gcp.saveChatMessage(sessionId, 'model', reply);

        res.json({ reply });
    } catch (err) {
        console.warn('Vertex AI error:', err.message);
        return res.json({
            reply: 'Demo Mode: Google Cloud model unavailable. Try asking "What is an EVM?" for an instant answer from the local guide.',
            demo: true
        });
    }
};

/**
 * Translates educational content using Google Cloud Translation API.
 * Uses caching to optimize identical translation requests.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleTranslate = async (req, res) => {
    const { text, targetLanguage } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required.' });
    }
    const allowedLanguages = ['hi', 'ta', 'bn', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'en'];
    if (!targetLanguage || !allowedLanguages.includes(targetLanguage)) {
        return res.status(400).json({ error: `targetLanguage must be one of: ${allowedLanguages.join(', ')}` });
    }

    if (!gcp.googleServicesReady) {
        return res.json({ translatedText: text, demo: true });
    }

    // Check cache
    const cacheKey = `translate_${targetLanguage}_${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        return res.json({ translatedText: cachedResponse });
    }

    try {
        const [response] = await gcp.translationClient.translateText({
            parent: `projects/${config.PROJECT_ID}/locations/global`,
            contents: [text.trim()],
            mimeType: 'text/plain',
            targetLanguageCode: targetLanguage,
        });
        
        const translatedText = response.translations[0].translatedText;
        cache.set(cacheKey, translatedText); // Cache the result
        
        res.json({ translatedText });
    } catch (err) {
        console.error('Translation error:', err.message);
        res.status(500).json({ error: 'Translation service temporarily unavailable.' });
    }
};

/**
 * Analyzes text for entities and sentiment using Google Cloud Natural Language API.
 * Caches results to prevent redundant API calls.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleAnalyze = async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required.' });
    }
    if (text.length > 5000) {
        return res.status(400).json({ error: 'Text too long. Max 5000 characters.' });
    }

    if (!gcp.googleServicesReady) {
        return res.json({ entities: [], sentiment: { score: 0, magnitude: 0 }, demo: true });
    }

    // Check cache
    const cacheKey = `analyze_${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        return res.json(cachedResponse);
    }

    try {
        const document = { content: text.trim(), type: 'PLAIN_TEXT' };
        const [entitiesResult] = await gcp.nlpClient.analyzeEntities({ document });
        const [sentimentResult] = await gcp.nlpClient.analyzeSentiment({ document });

        const result = {
            entities: entitiesResult.entities.slice(0, 10).map(e => ({
                name: e.name,
                type: e.type,
                salience: parseFloat(e.salience.toFixed(3))
            })),
            sentiment: {
                score: sentimentResult.documentSentiment.score,
                magnitude: sentimentResult.documentSentiment.magnitude
            }
        };
        
        cache.set(cacheKey, result); // Cache the result

        res.json(result);
    } catch (err) {
        console.error('NLP error:', err.message);
        res.status(500).json({ error: 'NLP service temporarily unavailable.' });
    }
};
