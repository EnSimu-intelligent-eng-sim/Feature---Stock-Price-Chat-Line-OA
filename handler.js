const axios = require('axios');
const cheerio = require('cheerio');
const stockList = require('./stockList.js');
const { fetchStockData, findClosestMatch } = require('./utils');
const { generateImage } = require("./generateImage.js")

async function handleEvent(event, client) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return null;
    }

    const stockSymbol = event.message.text.toUpperCase().trim();
    let replyMessage;

    const stock = stockList.find(item => item.Symbol === stockSymbol);
    let stockData = stock;

    if (!stock) {
        const closestMatch = findClosestMatch(stockSymbol, stockList);
        if (closestMatch) {
            stockData = closestMatch;
        }
    }

    if (stockData) {
        try {
            const scrapedData = await fetchStockData(stockData.Symbol);

            if (scrapedData) {
                replyMessage = `
${stockData.Company} 
${stockData.Symbol}
Stock Price: ${scrapedData.price.toFixed(2)} Baht
Change: ${scrapedData.change}
High: ${scrapedData.high.toFixed(2)} Baht
Low: ${scrapedData.low.toFixed(2)} Baht
Volume: ${scrapedData.volume.toLocaleString()}
Value: ${scrapedData.value.toFixed(2)} (,000) Bath

*Data from Stock Exchange of Thailand (SET) as of ${scrapedData.timestamp}`;
            } else {
                replyMessage = `Sorry, I couldn't retrieve the stock data for ${stockData.Symbol}.`;
            }
        } catch (error) {
            replyMessage = `An error occurred while fetching stock data for ${stockData.Symbol}.`;
        }
    } else {
        replyMessage = `Sorry, I couldn't find a close match for the stock symbol ${stockSymbol}.`;
    }

    return client.replyMessage(event.replyToken, { type: 'text', text: replyMessage });
}

module.exports = { handleEvent };
