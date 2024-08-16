const line = require("@line/bot-sdk");
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");





const app = express();


// Load environment variables
dotenv.config();  

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,  
    channelAccessToken: process.env.ACCESS_TOKEN 
};


// Create Client 
const client = new line.Client(lineConfig)



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
    if(event.type !== 'message' || event.message.type !== 'text'){
        return null;
    }else if(event.type == 'message'){
        const stockSymbol = event.message.text
        if(pass){
            
        }






        return client.replyMessage(event.replyToken, {type:'text', text:'test'})
};};

app.listen(4000, () => {
    console.log('listening on PORT:4000');
});
