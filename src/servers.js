const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const { handleEvent } = require("./handler");

dotenv.config();

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,
    channelAccessToken: process.env.ACCESS_TOKEN
};

const client = new line.Client(lineConfig);
const app = express();

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log('event=>>>>', events);

        if (events.length > 0) {
            await Promise.all(events.map(event => handleEvent(event, client)));
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.listen(4000, () => {
    console.log('listening on PORT:4000');
});
