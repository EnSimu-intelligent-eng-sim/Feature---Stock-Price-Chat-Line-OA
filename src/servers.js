const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const { handleEvent } = require("./handler");

dotenv.config();

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,
    channelAccessToken: process.env.ACCESS_TOKEN
};

// Add debug logging
console.log('Channel Secret:', process.env.SECRET_TOKEN ? 'Set' : 'Not Set');
console.log('Channel Access Token:', process.env.ACCESS_TOKEN ? 'Set' : 'Not Set');

const client = new line.Client(lineConfig);
const app = express();

app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('X-Line-Signature:', req.headers['x-line-signature']);
    next();
});

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log('event=>>>>', events);

        if (events.length > 0) {
            await Promise.all(events.map(event => handleEvent(event, client)));
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).end();
    }
});

app.listen(4000, () => {
    console.log('listening on PORT:4000');
    console.log('Line Bot Configuration loaded');
});