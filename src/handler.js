const { handleFeatureA } = require('./features/featureA');
const { handleFeatureB } = require('./features/featureB');
const { handleFeatureC } = require('./features/featureC');
const { handleStockPrice } = require('./features/stockPrice');

let userContexts = {}; // Temporary storage for user contexts

async function handleEvent(event, client) {
    const userId = event.source.userId;

    // Initialize context for new users
    if (!userContexts[userId]) {
        userContexts[userId] = { state: 'initial', previousState: null };
    }

    if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text.toLowerCase().trim();
        let replyMessage;

        // Handle the "thank you" command for deactivation
        if (userMessage === 'thank you') {
            delete userContexts[userId]; // Remove user context to deactivate
            replyMessage = { type: 'text', text: 'Thank you! The bot is now deactivated.' };
            return client.replyMessage(event.replyToken, replyMessage);
        }

        // Handle the "back" command
        if (userMessage === 'back') {
            if (userContexts[userId].previousState) {
                userContexts[userId].state = userContexts[userId].previousState;
                userContexts[userId].previousState = null;
                replyMessage = { type: 'text', text: 'Going back to the previous state.' };
            } else {
                replyMessage = { type: 'text', text: 'There is no previous state to go back to.' };
            }
            return client.replyMessage(event.replyToken, replyMessage);
        }

        // Handle stock symbol input
        if (userContexts[userId].state === 'awaitingStockSymbol') {
            return handleStockPrice(event, client);
        } else if (userMessage === 'hi') {
            // Show the feature list when user says "hi"
            const replyMessage = {
                type: 'template',
                altText: 'Feature menu',
                template: {
                    type: 'carousel',
                    columns: [
                        {
                            thumbnailImageUrl: 'https://example.com/featureA.jpg',
                            title: 'Feature A',
                            text: 'Description of Feature A',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Select Feature A',
                                    data: 'featureA'
                                }
                            ]
                        },
                        {
                            thumbnailImageUrl: 'https://example.com/featureB.jpg',
                            title: 'Feature B',
                            text: 'Description of Feature B',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Select Feature B',
                                    data: 'featureB'
                                }
                            ]
                        },
                        {
                            thumbnailImageUrl: 'https://example.com/featureC.jpg',
                            title: 'Feature C',
                            text: 'Description of Feature C',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Select Feature C',
                                    data: 'featureC'
                                }
                            ]
                        },
                        {
                            thumbnailImageUrl: 'https://example.com/stockPrice.jpg',
                            title: 'Stock Price',
                            text: 'Ask me for stock price',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Select Stock Price',
                                    data: 'stockPrice'
                                }
                            ]
                        }
                    ]
                }
            };
            userContexts[userId].state = 'initial'; // Reset state
            userContexts[userId].previousState = null; // Clear previous state
            return client.replyMessage(event.replyToken, replyMessage);
        } else {
            return client.replyMessage(event.replyToken, { type: 'text', text: 'Sorry, I didn\'t understand that.' });
        }
    } else if (event.type === 'postback') {
        const data = event.postback.data;

        switch (data) {
            case 'featureA':
                return handleFeatureA(event, client);
            case 'featureB':
                return handleFeatureB(event, client);
            case 'featureC':
                return handleFeatureC(event, client);
            case 'stockPrice':
                userContexts[userId].previousState = userContexts[userId].state;
                userContexts[userId].state = 'awaitingStockSymbol'; // Set state to await stock symbol
                return client.replyMessage(event.replyToken, { type: 'text', text: 'Please enter the stock symbol (e.g., AAPL):' });
            default:
                return client.replyMessage(event.replyToken, { type: 'text', text: 'Unknown selection.' });
        }
    } else {
        // Handle other cases
        return client.replyMessage(event.replyToken, { type: 'text', text: 'Sorry, I didn\'t understand that.' });
    }
}

module.exports = { handleEvent };
