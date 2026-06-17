const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const errorMiddleware = require('./middleware/error');
const cors = require('cors');

app.use(cors({
  origin: 'https://rentup-frontend.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.options('*', cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
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
