const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://simar1234:PCnQPDN9RqtcYOHY@cluster0.irnkbj3.mongodb.net/?appName=Cluster0", {family: 4})
    .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
};

module.exports = connectDatabase;
