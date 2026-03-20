const User = require('../model/userModel');
const sendToken = require('../util/jwtToken');
const catchAsyncErrors = require('../middleware/catchAyncHandler');
const ErrorHandler = require('../util/errorHandler')
const cloudinary = require('cloudinary');
const Booking = require('../model/bookingModel');
const House = require('../model/houseModel');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: 'Avatars',
      width: 150,
      crop: 'scale',
    });
    const { name, email, password } = req.body;
    if(!email || !password || !name){
      return next(new ErrorHandler('Please enter all fields coreeectly', 400));
    }
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    sendToken(user, 201, res);
});  

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter Email or Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // 🔒 Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return next(
      new ErrorHandler('Too many attempts. Try again after 5 minutes', 429)
    );
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    user.loginAttempts += 1;

    // 🚫 Lock after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
      user.loginAttempts = 0; // reset attempts after lock
    }

    await user.save();

    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncErrors(async(req, res, next) => {
      res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: 'Logged out ',
      });
});

//Get Logged in User Deatil
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    user,
  });
});

//Update Password
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
      const user = await User.findById(req.user.id).select('+password');
      const matchPasswords = await user.comparePassword(req.body.oldPassword);
      if(!matchPasswords){
          return next(new ErrorHandler('Old password is incorrect', 404));
      }
      if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("New password does not match with confirmed one", 404));
      }
      user.password = req.body.newPassword;
      await user.save();
      sendToken(user, 200, res);
});

//Update User Profile
exports.updateUserProfile = catchAsyncErrors(async(req, res, next) => {
      const newUserData = {
        name: req.body.name,
        email: req.body.email
      };
      //Write for change profile photo

      const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        user
      });
});

/**********************************************************************************/
//Admin Routes Below
/**********************************************************************************/

exports.getAllUsersData = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users
    });
});

exports.getSingleUserData = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
      const user = await User.findById(id);
      if (!user) {
          return next(new ErrorHandler(`User does not exist with the given id: ${id}`));
      }


      let bookings = await Booking.find({ user: id });
      if (!bookings) {
          bookings = null;
      }


      let listings = await House.find({ user: id });
      if (!listings) {
          listings = null;
      }

      res.status(200).json({
          success: true,
          user,
          bookings,
          listings
      });
  } catch (error) {
      console.error('Error in getSingleUserData:', error);
      return next(new ErrorHandler('Internal Server Error', 500));
  }
});


exports.updateUserRole = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

exports.deleteTheGivenUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler(`User does not exist with the given id: ${req.params.id}`));
    }

    //For deleting image from cloudinary
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User has been deleted successfully",
    });
})