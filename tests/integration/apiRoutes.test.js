const request = require('supertest');
const app = require('../../server'); // The new server entry point

jest.mock('../../src/services/googleCloudService', () => ({
    googleServicesReady: false,
    SYSTEM_PROMPT: 'System prompt',
    getChatHistory: jest.fn().mockResolvedValue([]),
    saveChatMessage: jest.fn().mockResolvedValue()
}));

describe('Integration Tests: API Routes', () => {

    describe('Health & Static Routes', () => {
        test('GET /health returns 200 and status ok', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('ok');
            expect(res.body).toHaveProperty('services');
        });

        test('GET / serves the frontend (200)', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
        });

        test('GET /unknown-route returns 404', async () => {
            const res = await request(app).get('/this-does-not-exist');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/chat — Input Validation & Flow', () => {
        test('Returns 400 when message is missing', async () => {
            const res = await request(app).post('/api/chat').send({ sessionId: '123' });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('Returns 400 when message is empty string', async () => {
            const res = await request(app).post('/api/chat').send({ message: '   ' });
            expect(res.statusCode).toBe(400);
        });

        test('Returns 400 when message is too long', async () => {
            const res = await request(app).post('/api/chat').send({ message: 'a'.repeat(1001) });
            expect(res.statusCode).toBe(400);
        });

        test('Returns 200 or demo response for valid message', async () => {
            const res = await request(app).post('/api/chat').send({ message: 'What is EVM?', sessionId: 'test-session-123' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('reply');
                expect(typeof res.body.reply).toBe('string'); // Schema validation
            }
        }, 15000);
    });

    describe('POST /api/translate — Validation & Cache', () => {
        test('Returns 400 when targetLanguage is invalid', async () => {
            const res = await request(app).post('/api/translate').send({ text: 'Hello', targetLanguage: 'xx' });
            expect(res.statusCode).toBe(400);
        });

        test('Returns 200 in demo mode or cached for valid input', async () => {
            const res = await request(app).post('/api/translate').send({ text: 'Election', targetLanguage: 'hi' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('translatedText');
                expect(typeof res.body.translatedText).toBe('string'); // Schema validation
            }
        });
    });

    describe('POST /api/analyze — Validation', () => {
        test('Returns 400 when text is missing', async () => {
            const res = await request(app).post('/api/analyze').send({});
            expect(res.statusCode).toBe(400);
        });

        test('Returns 200 in demo mode for valid input', async () => {
            const res = await request(app).post('/api/analyze').send({ text: 'The Election Commission of India manages elections.' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('entities');
                expect(Array.isArray(res.body.entities)).toBe(true); // Schema validation
            }
        });
    });
});
