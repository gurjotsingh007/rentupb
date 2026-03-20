const ErrorHandler = require("../util/errorHandler");
const catchAyncHandler = require("./catchAyncHandler");
const jwt = require('jsonwebtoken');
const User = require('../model/userModel')

exports.isUserIsAuthenticated = catchAyncHandler(async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return next(new ErrorHandler('User must be logged in to access', 401));
    }
    const decodedToken = jwt.verify(token, 'ASDFGHJKLELLEASDFGHJKL');
    req.user = await User.findById(decodedToken.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`, 403
            ));
        }
        next();
    }
};