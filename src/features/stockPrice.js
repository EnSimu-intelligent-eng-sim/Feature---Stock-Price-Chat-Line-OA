const stockList = require('../../client/stockList');
const { fetchStockData, findClosestMatches } = require('../../src/utils');
const stockPriceCard = require('../../templates/stockPriceCard');


async function handleStockPrice(event, client) {
    const stockSymbol = event.message.text.toUpperCase().trim();
    let replyMessage;

    console.log('Received stock symbol:', stockSymbol);

    const stock = stockList.find(item => item.Symbol === stockSymbol);

    if (!stock) {
        console.log('Symbol not found, finding closest matches...');
        const closestMatches = findClosestMatches(stockSymbol, stockList);
        console.log('Closest matches found:', closestMatches);

        if (closestMatches.length > 0) {
            replyMessage = {
                type: 'text',
                text: `Did you mean one of these?\n${closestMatches.map(stock => `- ${stock.Symbol}: ${stock.Company}`).join('\n')}`
            };
        } else {
            replyMessage = { type: 'text', text: `Sorry, I couldn't find a match for the stock symbol ${stockSymbol}.` };
        }
    } else {
        try {
            const scrapedData = await fetchStockData(stock.Symbol);

            if (scrapedData) {
                // Clone the template to avoid modifying the original
                const template = JSON.parse(JSON.stringify(stockPriceCard));
                
                // Replace template placeholders with actual data
                const contents = template.body.contents;
                contents[0].text = scrapedData.marketTrend.includes('Bullish') ? 'Market: Bullish' :
                                 scrapedData.marketTrend.includes('Bearish') ? 'Market: Bearish' : 'Market: Neutral';
                contents[0].color = scrapedData.marketTrend.includes('Bullish') ? '#00b300' :
                                  scrapedData.marketTrend.includes('Bearish') ? '#ff0000' : '#888888';
                contents[1].text = stockSymbol;
                contents[2].text = stock.Company;

                // Update price information
                const priceBox = contents[4].contents;
                priceBox[0].contents[1].text = `${scrapedData.price.toFixed(2)} Baht`;
                priceBox[1].contents[1].text = `${scrapedData.change} (${scrapedData.percentageChange})`;
                priceBox[1].contents[1].color = scrapedData.change.startsWith('-') ? '#FF0000' : '#00FF00';
                priceBox[2].contents[1].text = `${scrapedData.high.toFixed(2)}/${scrapedData.low.toFixed(2)}`;
                priceBox[3].contents[1].text = scrapedData.volume.toLocaleString();

                // Update footer information
                const footer = priceBox[5].contents;
                footer[0].text = scrapedData.volumeAnalysis || 'Stock Exchange of Thailand (SET)';
                footer[1].text = scrapedData.timestamp;

                replyMessage = {
                    type: 'flex',
                    altText: `Stock Price for ${stock.Symbol}`,
                    contents: template
                };
            } else {
                replyMessage = { type: 'text', text: `Sorry, I couldn't retrieve the stock data for ${stock.Symbol}.` };
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            replyMessage = { type: 'text', text: `An error occurred while fetching stock data for ${stock.Symbol}.` };
        }
    }

    return client.replyMessage(event.replyToken, replyMessage);
}

module.exports = { handleStockPrice };
