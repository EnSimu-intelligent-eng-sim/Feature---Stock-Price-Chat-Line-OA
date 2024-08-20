const puppeteer = require('puppeteer');
const path = require('path');
const template = require("./stockQuoteHTML")

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateStockQuoteImage(stockData) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set content with stock data
    await page.setContent(stockData.html);

    // Wait for the content to render
    await delay(5000); // Wait for 5 seconds

    // Define the path where the image will be saved
    const imagePath = path.join(__dirname, 'stock-quote.png');

    // Take a screenshot of the rendered page
    await page.screenshot({ path: imagePath, fullPage: true });

    await browser.close();

    return imagePath;
}

// Example usage
const stockData = {
    html: '<html><body><h1>Stock Quote</h1></body></html>' // Replace with your HTML content
};

generateStockQuoteImage(stockData)
    .then(imagePath => console.log(`Image saved to ${imagePath}`))
    .catch(err => console.error(`Error generating image: ${err}`));
