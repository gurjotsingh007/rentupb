const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,        // ← ADD THIS
        sameSite: 'None',    // ← ADD THIS
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};
module.exports = sendToken;
