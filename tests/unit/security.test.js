const request = require('supertest');
const express = require('express');
const { helmetMiddleware, apiLimiter, sanitizeInput, errorHandler } = require('../../src/middlewares/security');

describe('Security Middlewares', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
    });

    describe('sanitizeInput', () => {
        it('should sanitize string inputs by stripping HTML', async () => {
            app.post('/test-sanitize', sanitizeInput, (req, res) => {
                res.json(req.body);
            });

            const res = await request(app)
                .post('/test-sanitize')
                .send({
                    clean: 'clean string',
                    dirty: '<b>dirty string</b>',
                    number: 42,
                    obj: { nested: '<html>' } // Should not touch nested or non-strings if not supported, but we test current behavior
                });

            expect(res.body.clean).toBe('clean string');
            expect(res.body.dirty).toBe('dirty string');
            expect(res.body.number).toBe(42);
        });

        it('should handle empty body gracefully', async () => {
            app.post('/test-empty', sanitizeInput, (req, res) => {
                res.status(200).send('OK');
            });
            const res = await request(app).post('/test-empty').send();
            expect(res.status).toBe(200);
        });
    });

    describe('Global Error Handler', () => {
        it('should return 500 for unhandled errors', async () => {
            app.get('/error', (req, res, next) => {
                next(new Error('Test error'));
            });
            app.use(errorHandler);

            const res = await request(app).get('/error');
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal server error.');
        });
    });

    describe('Helmet Middleware', () => {
        it('should apply security headers', async () => {
            app.use(helmetMiddleware);
            app.get('/helmet', (req, res) => res.send('ok'));

            const res = await request(app).get('/helmet');
            expect(res.headers['content-security-policy']).toBeDefined();
            expect(res.headers['x-powered-by']).toBeUndefined();
        });
    });

    describe('Rate Limiter', () => {
        it('should include rate limiting headers', async () => {
            app.use(apiLimiter);
            app.get('/limit', (req, res) => res.send('ok'));

            const res = await request(app).get('/limit');
            expect(res.headers['ratelimit-limit']).toBeDefined();
            expect(res.headers['ratelimit-remaining']).toBeDefined();
        });
    });
});
