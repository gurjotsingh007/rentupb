const app = require('./app');
const connectDatabase = require('./config/db');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const express = require('express');
require('dotenv').config();

async function startServer() {
    try {
        await connectDatabase();

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });

        // Only serve frontend build if it exists (for full-stack deployments)
        // Remove this block if deploying backend only on Render
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname, '/frontend/build')));
        app.get('*', (req, res) =>
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
        );

        const PORT = process.env.PORT || 3000;

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        process.on('uncaughtException', (err) => {
            console.error(`Uncaught Exception: ${err.message}`);
            shutdown(server);
        });

        process.on('unhandledRejection', (err) => {
            console.error(`Unhandled Promise Rejection: ${err.message}`);
            shutdown(server);
        });
    }
    catch (err) {
        console.error(`Error during server start: ${err.message}`);
    }
}

function shutdown(server) {
    console.log('Shutting Down the Server');
    server.close(() => {
        process.exit(1);
    });
}

startServer();