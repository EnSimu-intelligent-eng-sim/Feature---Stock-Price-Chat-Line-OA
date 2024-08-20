const line = require("@line/bot-sdk");
const express = require("express");
const dotenv = require("dotenv");
const axios = require('axios');
const cheerio = require('cheerio');

const stockList = require('./stockList.js'); // Correct path

const app = express();

// Load environment variables
dotenv.config();

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,
    channelAccessToken: process.env.ACCESS_TOKEN
};

// Create Client 
const client = new line.Client(lineConfig);

// Webhook setup 
app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log('event=>>>>', events);

        if (events.length > 0) {
            await Promise.all(events.map(handleEvent));
        }

        res.status(200).send("OK");  // Always send a response to the LINE server
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).end();  // Respond with an error status
    }
});

const handleEvent = async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return null;
    }

    const stockSymbol = event.message.text.toUpperCase().trim();

    let replyMessage;

    // Find the stock by symbol or closest match
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
};

async function fetchStockData(symbol) {
    try {
        const url = `https://www.set.or.th/en/market/product/stock/quote/${symbol}/price`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract and format the data
        const stockPriceText = $('.quote-info-left-values').first().text().trim();
        const highPriceText = $('.quote-market-high span').last().text().trim();
        const lowPriceText = $('.quote-market-low span').last().text().trim();
        const volumeText = $('.quote-market-volume span').last().text().trim();
        const valueText = $('.quote-market-cost span').last().text().trim();
        const changeText = $('.quote-info-left-values h3').text().trim();

        // Convert text to numeric values
        const stockPrice = parseFloat(stockPriceText.replace(/[^0-9.]/g, ''));
        const highPrice = parseFloat(highPriceText.replace(/[^0-9.]/g, ''));
        const lowPrice = parseFloat(lowPriceText.replace(/[^0-9.]/g, ''));
        const volume = parseInt(volumeText.replace(/[^0-9]/g, ''), 10);
        const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));
        const change = changeText;

        // Get the current timestamp in the desired format (DD/MM/YYYY)
        const date = new Date();
        const timestamp = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        // Return the formatted stock data
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

function findClosestMatch(userInput, stockList) {
    const threshold = 0.6; // Similarity threshold
    let bestMatch = null;
    let bestSimilarity = 0;

    for (const stock of stockList) {
        const similarity = stringSimilarity(userInput, stock.Symbol);
        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = stock;
        }
    }

    return bestSimilarity > threshold ? bestMatch : null;
}

function stringSimilarity(str1, str2) {
    let longer = str1;
    let shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(str1, str2) {
    const costs = [];
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[str2.length] = lastValue;
    }
    return costs[str2.length];
}

app.listen(4000, () => {
    console.log('listening on PORT:4000');
});
