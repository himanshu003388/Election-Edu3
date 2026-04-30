const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    PORT: process.env.PORT || 8080,
    PROJECT_ID: process.env.GCP_PROJECT_ID || 'demo-project',
    REGION: process.env.GCP_REGION || 'us-central1',
    NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;
