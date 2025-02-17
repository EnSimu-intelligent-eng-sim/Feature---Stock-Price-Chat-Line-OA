const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require('string-similarity');

async function fetchStockData(symbol) {
    try {
        const url = `https://www.set.or.th/en/market/product/stock/quote/${symbol}/price`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Basic price information
        const stockPriceText = $('.quote-info-left-values').first().text().trim();
        const highPriceText = $('.quote-market-high span').last().text().trim();
        const lowPriceText = $('.quote-market-low span').last().text().trim();
        const volumeText = $('.quote-market-volume span').last().text().trim();
        const valueText = $('.quote-market-cost span').last().text().trim();
        const changeText = $('.quote-info-left-values h3').text().trim();
        const openText = $('.quote-market-open span').last().text().trim();
        const prevCloseText = $('.quote-market-previous-close span').last().text().trim();

        // Parse values
        const stockPrice = parseFloat(stockPriceText.replace(/[^0-9.]/g, ''));
        const highPrice = parseFloat(highPriceText.replace(/[^0-9.]/g, ''));
        const lowPrice = parseFloat(lowPriceText.replace(/[^0-9.]/g, ''));
        const volume = parseInt(volumeText.replace(/[^0-9]/g, ''), 10);
        const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));
        const change = changeText;
        const openPrice = parseFloat(openText.replace(/[^0-9.]/g, ''));
        const prevClose = parseFloat(prevCloseText.replace(/[^0-9.]/g, ''));

        // Calculate additional technical indicators
        const percentageChange = ((stockPrice - prevClose) / prevClose * 100).toFixed(2);
        const volumeAnalysis = analyzeVolume(volume, prevClose, stockPrice);
        
        // Market trend analysis
        const trend = analyzeTrend(stockPrice, prevClose, volume);

        const date = new Date();
        const timestamp = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

        return {
            price: stockPrice,
            change: change,
            percentageChange: `${percentageChange}%`,
            high: highPrice,
            low: lowPrice,
            open: openPrice,
            prevClose: prevClose,
            volume: volume,
            value: value,
            volumeAnalysis: volumeAnalysis,
            marketTrend: trend,
            timestamp: timestamp
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function analyzeVolume(currentVolume, prevClose, currentPrice) {
    // Volume analysis with price action
    if (currentVolume > 1000000) { // High volume threshold
        if (currentPrice > prevClose) {
            return "High volume with price increase - Strong buying pressure";
        } else if (currentPrice < prevClose) {
            return "High volume with price decrease - Strong selling pressure";
        }
    }
    return "Normal trading volume";
}

function analyzeTrend(currentPrice, prevClose, volume) {
    // Simple trend analysis
    const priceChange = ((currentPrice - prevClose) / prevClose) * 100;
    
    if (priceChange > 2 && volume > 1000000) {
        return "Strong Bullish";
    } else if (priceChange > 0.5) {
        return "Bullish";
    } else if (priceChange < -2 && volume > 1000000) {
        return "Strong Bearish";
    } else if (priceChange < -0.5) {
        return "Bearish";
    }
    return "Neutral";
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