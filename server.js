const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static('./'));

// Proxy endpoint
app.get('/api/vehicle-info', async (req, res) => {
    try {
        const vehicleNumber = req.query.number;
        const response = await fetch(`https://botmaker.serv00.net/vehicle-info.php?number=${vehicleNumber}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
