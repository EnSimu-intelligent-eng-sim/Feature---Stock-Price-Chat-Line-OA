const stockList = require('../../client/stockList');
const { fetchStockData, findClosestMatches } = require('../../src/utils');

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
                replyMessage = {
                    type: 'flex',
                    altText: `Stock Price for ${stock.Symbol}`,
                    contents: {
                        type: 'bubble',
                        body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                { type: 'text', text: stockSymbol, weight: 'bold', size: 'xxl', margin: 'md' },
                                { type: 'text', text: stock.Company, size: 'xs', color: '#aaaaaa', wrap: true },
                                { type: 'separator', margin: 'md' },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    margin: 'md',
                                    spacing: 'sm',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'horizontal',
                                            contents: [
                                                { type: 'text', text: 'Price:', size: 'sm', color: '#555555', flex: 0 },
                                                { type: 'text', text: `${scrapedData.price.toFixed(2)} Baht`, size: 'sm', color: '#111111', align: 'end' }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'horizontal',
                                            contents: [
                                                { type: 'text', text: 'Change:', size: 'sm', color: '#555555', flex: 0 },
                                                { type: 'text', text: scrapedData.change, size: 'sm', color: scrapedData.change.startsWith('-') ? '#FF0000' : '#00FF00', align: 'end', weight: 'bold' }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'horizontal',
                                            contents: [
                                                { type: 'text', text: 'High/Low:', size: 'sm', color: '#555555', flex: 0 },
                                                { type: 'text', text: `${scrapedData.high.toFixed(2)}/${scrapedData.low.toFixed(2)}`, size: 'sm', color: '#111111', align: 'end' }
                                            ]
                                        },
                                        {
                                            type: 'box',
                                            layout: 'horizontal',
                                            contents: [
                                                { type: 'text', text: 'Volume:', size: 'sm', color: '#555555', flex: 0 },
                                                { type: 'text', text: scrapedData.volume.toLocaleString(), size: 'sm', color: '#111111', align: 'end' }
                                            ]
                                        }
                                    ]
                                },
                                { type: 'separator', margin: 'md' },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    margin: 'md',
                                    contents: [
                                        { type: 'text', text: 'Stock Exchange of Thailand (SET)', size: 'xs', color: '#aaaaaa', flex: 0 },
                                        { type: 'text', text: scrapedData.timestamp, color: '#aaaaaa', size: 'xxs', align: 'start' }
                                    ]
                                }
                            ]
                        }
                    }
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
