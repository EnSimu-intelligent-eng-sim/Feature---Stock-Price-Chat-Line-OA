const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require('string-similarity');

async function fetchStockData(symbol) {
    try {
        const url = `https://www.set.or.th/en/market/product/stock/quote/${symbol}/price`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const stockPriceText = $('.quote-info-left-values').first().text().trim();
        const highPriceText = $('.quote-market-high span').last().text().trim();
        const lowPriceText = $('.quote-market-low span').last().text().trim();
        const volumeText = $('.quote-market-volume span').last().text().trim();
        const valueText = $('.quote-market-cost span').last().text().trim();
        const changeText = $('.quote-info-left-values h3').text().trim();

        const stockPrice = parseFloat(stockPriceText.replace(/[^0-9.]/g, ''));
        const highPrice = parseFloat(highPriceText.replace(/[^0-9.]/g, ''));
        const lowPrice = parseFloat(lowPriceText.replace(/[^0-9.]/g, ''));
        const volume = parseInt(volumeText.replace(/[^0-9]/g, ''), 10);
        const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));
        const change = changeText;

        const date = new Date();
        const timestamp = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        return {
            price: stockPrice,
            change: change,
            high: highPrice,
            low: lowPrice,
            volume: volume,
            value: value,
            timestamp: timestamp
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function findClosestMatches(input, stockList) {
    const threshold = 0.6;
    const matches = [];

    for (const stock of stockList) {
        const similarity = stringSimilarity.compareTwoStrings(input, stock.Symbol);
        if (similarity > threshold) {
            matches.push(stock);
        }
    }

    return matches.sort((a, b) => stringSimilarity.compareTwoStrings(input, b.Symbol) - stringSimilarity.compareTwoStrings(input, a.Symbol)).slice(0, 4);
}

module.exports = { fetchStockData, findClosestMatches };