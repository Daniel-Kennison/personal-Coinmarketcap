const express = require('express');
const axios = require('axios');
const basicAuth = require('basic-auth');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle basic authentication
app.use((req, res, next) => {
    const user = basicAuth(req);
    if (!user || user.name !== process.env.BASIC_AUTH_USER || user.pass !== process.env.BASIC_AUTH_PASS) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Crypto App"');
        return res.status(401).send('Authentication required');
    }
    next();
});

// Fetch real-time cryptocurrency data from a public API
app.get('/api/cryptos', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 20,
                page: 1,
                sparkline: false
            }
        });

        // Send the data as JSON
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Failed to fetch cryptocurrency data');
    }
});

// Serve the frontend HTML
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});