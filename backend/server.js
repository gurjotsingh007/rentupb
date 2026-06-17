const app = require('./app');
const connectDatabase = require('./config/db');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

async function startServer() {
    try {
        await connectDatabase();

        cloudinary.config({
            cloud_name: 'dl8uix1z9',
            api_key: '786211711552324',
            api_secret: 'U9wVS1ywp2haJbd_CTOAVK3hrHk',
            secure: true
        });

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
