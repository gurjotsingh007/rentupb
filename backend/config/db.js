const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://gndu:K5IXNykik3m0kAPV@cluster0.0kfb5u2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {family: 4})
    .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
};

module.exports = connectDatabase;