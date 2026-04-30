const apiController = require('../../src/controllers/apiController');
const gcp = require('../../src/services/googleCloudService');
const cache = require('../../src/services/cacheService');

// Mock external services
jest.mock('../../src/services/googleCloudService', () => ({
    googleServicesReady: true,
    SYSTEM_PROMPT: 'System prompt mock',
    saveChatMessage: jest.fn(),
    getChatHistory: jest.fn().mockResolvedValue([]),
    generativeModel: {
        startChat: jest.fn().mockReturnValue({
            sendMessage: jest.fn().mockResolvedValue({
                response: {
                    candidates: [{ content: { parts: [{ text: 'Mock AI response' }] } }]
                }
            })
        })
    },
    translationClient: {
        translateText: jest.fn().mockResolvedValue([{ translations: [{ translatedText: 'Mock Translation' }] }])
    },
    nlpClient: {
        analyzeEntities: jest.fn().mockResolvedValue([{ entities: [{ name: 'Election', type: 'EVENT', salience: 0.9 }] }]),
        analyzeSentiment: jest.fn().mockResolvedValue([{ documentSentiment: { score: 0.5, magnitude: 0.8 } }])
    }
}));

jest.mock('../../src/services/cacheService', () => ({
    get: jest.fn(),
    set: jest.fn()
}));

describe('API Controller Unit Tests', () => {

    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getHealth', () => {
        it('should return health status', () => {
            apiController.getHealth(req, res);
            expect(res.json).toHaveBeenCalledWith({
                status: 'ok',
                services: expect.any(Object)
            });
        });
    });

    describe('handleChat', () => {
        it('should return 400 for empty message', async () => {
            req.body.message = '';
            await apiController.handleChat(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 for empty string message', async () => {
            req.body.message = '   ';
            await apiController.handleChat(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Message cannot be empty.' }));
        });

        it('should return 400 for too long message', async () => {
            req.body.message = 'a'.repeat(1001);
            await apiController.handleChat(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/too long/) }));
        });

        it('should generate a response using Vertex AI and save to Firestore', async () => {
            req.body.message = 'Hello AI';
            req.body.sessionId = 'test-session';

            await apiController.handleChat(req, res);

            expect(gcp.getChatHistory).toHaveBeenCalledWith('test-session');
            expect(gcp.saveChatMessage).toHaveBeenCalledWith('test-session', 'user', 'Hello AI');
            expect(gcp.saveChatMessage).toHaveBeenCalledWith('test-session', 'model', 'Mock AI response');
            expect(res.json).toHaveBeenCalledWith({ reply: 'Mock AI response' });
        });

        it('should handle Vertex AI failure gracefully', async () => {
            req.body.message = 'Hello AI';
            gcp.generativeModel.startChat.mockReturnValueOnce({
                sendMessage: jest.fn().mockRejectedValue(new Error('Vertex AI Timeout'))
            });

            await apiController.handleChat(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                reply: expect.stringMatching(/Demo Mode: Google Cloud model unavailable/),
                demo: true
            }));
        });
    });

    describe('handleTranslate', () => {
        it('should return 400 if text is missing', async () => {
            req.body = { targetLanguage: 'hi' };
            await apiController.handleTranslate(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 if targetLanguage is invalid', async () => {
            req.body = { text: 'Hello', targetLanguage: 'xx' };
            await apiController.handleTranslate(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return from cache if available', async () => {
            req.body = { text: 'Hello', targetLanguage: 'hi' };
            cache.get.mockReturnValue('नमस्ते');

            await apiController.handleTranslate(req, res);

            expect(cache.get).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ translatedText: 'नमस्ते' });
            expect(gcp.translationClient.translateText).not.toHaveBeenCalled();
        });

        it('should call translation API if not in cache', async () => {
            req.body = { text: 'Hello', targetLanguage: 'hi' };
            cache.get.mockReturnValue(null);

            await apiController.handleTranslate(req, res);

            expect(gcp.translationClient.translateText).toHaveBeenCalled();
            expect(cache.set).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ translatedText: 'Mock Translation' });
        });

        it('should handle translation API failure gracefully', async () => {
            req.body = { text: 'Hello', targetLanguage: 'hi' };
            cache.get.mockReturnValue(null);
            gcp.translationClient.translateText.mockRejectedValueOnce(new Error('Translation API Error'));

            await apiController.handleTranslate(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Translation service temporarily unavailable.' });
        });
    });

    describe('handleAnalyze', () => {
        it('should return 400 if text is missing', async () => {
            req.body = {};
            await apiController.handleAnalyze(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 if text is too long', async () => {
            req.body = { text: 'a'.repeat(5001) };
            await apiController.handleAnalyze(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return from cache if available', async () => {
            req.body = { text: 'Election 2024' };
            cache.get.mockReturnValue({ cached: 'result' });

            await apiController.handleAnalyze(req, res);

            expect(cache.get).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ cached: 'result' });
        });

        it('should call NLP API if not in cache', async () => {
            req.body = { text: 'Election 2024' };
            cache.get.mockReturnValue(null);

            await apiController.handleAnalyze(req, res);

            expect(gcp.nlpClient.analyzeEntities).toHaveBeenCalled();
            expect(gcp.nlpClient.analyzeSentiment).toHaveBeenCalled();
            expect(cache.set).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                entities: expect.any(Array),
                sentiment: expect.any(Object)
            }));
        });

        it('should handle NLP API failure gracefully', async () => {
            req.body = { text: 'Election 2024' };
            cache.get.mockReturnValue(null);
            gcp.nlpClient.analyzeEntities.mockRejectedValueOnce(new Error('NLP Timeout'));

            await apiController.handleAnalyze(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'NLP service temporarily unavailable.' });
        });
    });
});
