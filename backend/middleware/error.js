const ErrorHandler = require('../util/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    
    //mongoDB id error
    if (err.name === 'CastError') {
        const message = `Resource Not Found. Invalid err ${err.name}`;
        err = new ErrorHandler(message, 400);
    }    

    //Mongoose Duplicate Key Error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT Error
    if(err.code === 'JsonWebTokenError'){
        const message = `JsonWebToken is invalid, Please Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //JWT Expire Error
    if(err.code === 'TokenExpiredError'){
        const message = `JsonWebToken is Expired, Please Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};