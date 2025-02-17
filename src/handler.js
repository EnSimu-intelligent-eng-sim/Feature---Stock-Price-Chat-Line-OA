const { handleUnitConversion } = require('../features/unitConverter');
const { handleThermodynamics } = require('../features/thermodynamics');

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

        // Handle direct commands
        if (userMessage.startsWith('convert')) {
            return handleUnitConversion(event, client);
        } else if (userMessage.startsWith('thermo')) {
            return handleThermodynamics(event, client);
        } else if (userMessage === 'hi') {
            // Show the feature list
            const replyMessage = {
                type: 'template',
                altText: 'Feature menu',
                template: {
                    type: 'carousel',
                    columns: [
                        {
                            thumbnailImageUrl: 'https://example.com/unit-converter.jpg',
                            title: 'Unit Converter',
                            text: 'Convert between different units',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Unit Converter',
                                    data: 'unitConverter'
                                }
                            ]
                        },
                        {
                            thumbnailImageUrl: 'https://example.com/thermodynamics.jpg',
                            title: 'Ideal Gas Calculator',
                            text: 'Calculate ideal gas properties',
                            actions: [
                                {
                                    type: 'postback',
                                    label: 'Gas Calculator',
                                    data: 'thermodynamics'
                                }
                            ]
                        }
                    ]
                }
            };
            userContexts[userId].state = 'initial';
            userContexts[userId].previousState = null;
            return client.replyMessage(event.replyToken, replyMessage);
        } else {
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'Please say "hi" to see available features or use commands:\n- convert <value> <fromUnit> to <toUnit>\n- thermo P <value> <unit>, T <value> <unit>, V <value> <unit>'
            });
        }
    } else if (event.type === 'postback') {
        const data = event.postback.data;

        switch (data) {
            case 'unitConverter':
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Please use the format: convert <value> <fromUnit> to <toUnit>\nExample: convert 100 C to F'
                });
            case 'thermodynamics':
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Please use the format: thermo P <value> <unit>, T <value> <unit>, V <value> <unit>\nExample: thermo P 1 atm, T 298 K, V 22.4 L'
                });
            default:
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Unknown selection.'
                });
        }
    } else {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Sorry, I didn\'t understand that.'
        });
    }
}

module.exports = { handleEvent };
