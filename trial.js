const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    try {
        // Fetch the HTML from the URL
        const { data } = await axios.get('https://www.set.or.th/en/market/product/stock/quote/ptt/price');
        const $ = cheerio.load(data);

        // Extract and format the data
        const fullname = $('.security-name').text().trim(); 
        const symbol = $('.security-symbol').text().trim(); 
        const stockPriceText = $('.current-price span').first().text().trim();
        const highPriceText = $('.quote-high span').last().text().trim();
        const lowPriceText = $('.quote-low span').last().text().trim();
        const volumeText = $('.quote-market-volume span').last().text().trim();
        const valueText = $('.quote-market-cost span').last().text().trim();
        const changeText = $('.quote-info-left-values h3').text().trim(); 

        // Convert text to numeric values
        const stockPrice = parseFloat(stockPriceText.replace(/[^0-9.]/g, ''));
        const highPrice = parseFloat(highPriceText.replace(/[^0-9.]/g, ''));
        const lowPrice = parseFloat(lowPriceText.replace(/[^0-9.]/g, ''));
        const volume = parseInt(volumeText.replace(/[^0-9]/g, ''), 10);
        const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));

        // Check if the change is negative or positive and format it
        let changeValue = parseFloat(changeText.replace(/[^0-9.-]/g, ''));
        let changeSign = changeValue < 0 ? '-' : '+';
        changeValue = Math.abs(changeValue).toFixed(2);

        const change = `${changeSign}${changeValue}`;

        // Get the current timestamp in the desired format (DD/MM/YYYY)
        const date = new Date();
        const timestamp = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        // Output the results
        console.log(`Fullname: ${fullname}`);
        console.log(`Symbol: ${symbol}`);
        console.log(`Stock Price: ${stockPrice.toFixed(2)} Baht`);
        console.log(`Change: ${change} Baht`);
        console.log(`High: ${highPrice.toFixed(2)} Baht`);
        console.log(`Low: ${lowPrice.toFixed(2)} Baht`);
        console.log(`Volume: ${volume.toLocaleString()}`);
        console.log(`Value: ${value.toFixed(2)} (in '000 Baht)`);
        console.log(`*Data from Stock Exchange of Thailand (SET) Update at ${timestamp}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Output error status and timestamp
        console.log(`Status: Error`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
    }
})();
