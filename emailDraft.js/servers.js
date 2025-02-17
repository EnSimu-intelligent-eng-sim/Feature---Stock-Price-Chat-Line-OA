const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const { handleEvent } = require("./handler");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SECRET_TOKEN', 'ACCESS_TOKEN', 'SET_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Error: Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const PORT = process.env.PORT || 4000;

const lineConfig = {
    channelSecret: process.env.SECRET_TOKEN,
    channelAccessToken: process.env.ACCESS_TOKEN
};

// Initialize LINE client
const client = new line.Client(lineConfig);
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('X-Line-Signature:', req.headers['x-line-signature']);
    next();
});

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        
        if (!Array.isArray(events)) {
            console.error('Invalid events payload received:', events);
            return res.status(400).json({ error: 'Invalid events payload' });
        }

        if (events.length > 0) {
            console.log(`Processing ${events.length} events`);
            await Promise.all(events.map(async event => {
                try {
                    await handleEvent(event, client);
                } catch (eventError) {
                    console.error('Error handling event:', eventError, 'Event:', event);
                    // Continue processing other events
                }
            }));
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error('Webhook error:', error);
        // Send appropriate error response
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('LINE Bot configuration loaded');
    console.log('Environment:', process.env.NODE_ENV || 'development');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});