const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const errorMiddleware = require('./middleware/error');

// Increase limits for JSON and URL-encoded payloads
app.use(express.json({ limit: '100mb' })); // Adjust the limit according to your requirement
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 })); // Adjust the limit according to your requirement

app.use(cookieParser());
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 },
}));

const userRoutes = require('./route/userRoute');
const houseRoute = require('./route/houseRoute');
const bookingRoute = require('./route/bookingRoute');

app.use('/api/v2', userRoutes);
app.use('/api/v2', houseRoute);
app.use('/api/v2', bookingRoute);

app.use(errorMiddleware);

module.exports = app;