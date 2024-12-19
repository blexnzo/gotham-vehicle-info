export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    try {
        const { number } = req.query;
        if (!number) {
            return res.status(400).json({ status: 'error', message: 'Vehicle number is required' });
        }

        const apiUrl = `https://botmaker.serv00.net/vehicle-info.php?number=${encodeURIComponent(number)}`;
        console.log('Fetching from:', apiUrl); // Debug log

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Vercel Serverless Function'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        return res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'An error occurred while fetching vehicle information',
            error: error.message 
        });
    }
}
