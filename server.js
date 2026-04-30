// server.js
const express = require('express');
const path = require('path');
const config = require('./src/config/env');
const security = require('./src/middlewares/security');
const apiRoutes = require('./src/routes/apiRoutes');
const gcp = require('./src/services/googleCloudService'); // Ensure it initializes

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(security.helmetMiddleware);
app.use(express.json({ limit: '10kb' }));

// ── Static Files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', require('./src/controllers/apiController').getHealth);

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Global error handler
app.use(security.errorHandler);

// Start server only when run directly (not during tests)
if (require.main === module) {
    app.listen(config.PORT, () => {
        console.log(`ElectionEdu server running on port ${config.PORT}`);
    });
}

module.exports = app;