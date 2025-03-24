const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
    target: 'https://api.openf1.org',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1': '/v1', // rewrite /api/v1 to /v1 when forwarding to target
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    logLevel: 'debug' // Add logging to help debug issues
});

// Use the proxy middleware for /api routes
app.use('/api', apiProxy);

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
