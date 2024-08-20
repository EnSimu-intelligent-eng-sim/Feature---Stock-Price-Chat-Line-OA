const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const { handleEvent } = require("./handler");

const { genrateImage } = require("./generateImage")


dotenv.config();

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,
    channelAccessToken: process.env.ACCESS_TOKEN
};

const client = new line.Client(lineConfig);
const app = express();

// Webhook setup 
app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log('event=>>>>', events);

        if (events.length > 0) {
            await Promise.all(events.map(event => handleEvent(event, client) ));
        }

        res.status(200).send("OK");  // Always send a response to the LINE server
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).end();  // Respond with an error status
    }
});

app.listen(4000, () => {
    console.log('listening on PORT:4000');
});
