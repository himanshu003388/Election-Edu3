const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Content Security Policy middleware using Helmet.
 * Defines allowed sources for scripts, styles, fonts, and images.
 */
const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://www.google-analytics.com"],
            connectSrc: ["'self'", "https://www.google-analytics.com"],
        }
    }
});

/**
 * API Rate Limiting middleware.
 * Restricts each IP to 100 requests per 15-minute window.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

/**
 * Input Sanitization middleware.
 * Provides basic XSS protection by stripping HTML tags from string payloads.
 * Only targets string properties on the request body.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const sanitizeInput = (req, res, next) => {
    // A simple regex to strip out potentially dangerous HTML tags
    const stripHtml = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/<[^>]*>?/gm, '');
    };

    if (req.body) {
        for (let key in req.body) {
            if (req.body.hasOwnProperty(key) && typeof req.body[key] === 'string') {
                req.body[key] = stripHtml(req.body[key]);
            }
        }
    }
    next();
};

/**
 * Global Error Handler.
 * Catches unhandled exceptions and returns a generic 500 response.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err.message); // Log internal message, do not expose to user
    res.status(500).json({ error: 'Internal server error.' });
};

module.exports = {
    helmetMiddleware,
    apiLimiter,
    sanitizeInput,
    errorHandler
};
