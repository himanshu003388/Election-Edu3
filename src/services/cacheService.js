const NodeCache = require('node-cache');

// Standard TTL: 1 hour for translated strings and NLP results
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = cache;
