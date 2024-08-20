
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Route to serve the stock quote image
app.get('/stock-quote-image', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/images/stockQuoteImage.png'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
