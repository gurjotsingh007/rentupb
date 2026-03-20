const catchAyncHandler = require('../middleware/catchAyncHandler');
const Booking = require('../model/bookingModel');
const ErrorHandler = require('../util/errorHandler');
const House = require('../model/houseModel');
const User = require('../model/userModel');

exports.createBooking = catchAyncHandler(async(req, res, next) => {
    const {
        checkInDate,
        checkOutDate,
        guests,
        phoneNumber,
        taxPrice,
        housePrice,
        totalPrice,
        paymentMethod,
        housesIds,
        purchasingType
    } = req.body;
    const booking =  await Booking.create({
        checkInDate,
        checkOutDate,
        guests,
        taxPrice,
        phoneNumber,
        housePrice,
        totalPrice,
        paymentMethod,
        housesIds,
        purchasingType,
        paidAt:Date.now(),
        user:req.user.id
    });
    console.log('3');
    res.status(200).json({
        success: true,
        booking
    });
});

exports.getAllBookedHousesByIndividual = catchAyncHandler(async(req, res, next) => {
    const userId = req.user.id;

    const houses = await Booking.find({user: userId});
    // if(!houses.length){
    //     return next(new ErrorHandler('No booking are found', 401));
    // }

    res.status(200).json({
        success: true,
        houses
    });
});

exports.getSingleBookedHouseByIndividual = catchAyncHandler(async(req, res, next) => {
    const bookingId = req.params.id;

    const bookedHouse = await Booking.findById(bookingId);
    
    if(!Booking){
        return next(new ErrorHandler(`No booking for id ${bookingId} found`, 404));
    }

    const {housesIds, user} = bookedHouse;
        
    const houses = await Promise.all(housesIds.map(async (houseId) => {
        return await House.findById(houseId);
    }));

    const userDetails = await User.findById(user);

    res.status(200).json({
        success: true,
        Booking: bookedHouse,
        Houses: houses,
        User: userDetails
    });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateBookingStatus = catchAyncHandler(async(req, res, next) => {
    console.log('entering');
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorHandler('Booking Not Found with this ID', 404));
    }
    
    booking.paymentStatus.status = 'completed';

    booking.paidAt = Date.now();

    const updatedBooking = await booking.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      updatedBooking
    });
});

exports.getAllBookingsByAdmin = catchAyncHandler(async(req, res, next) => {
    const bookings = await Booking.find();
    
    if(!bookings){
        return next(new ErrorHandler('No bookings has been done yet', 404));
    }

    res.status(200).json({
        success:true,
        bookings
    });
});

exports.deleteBooking = catchAyncHandler(async(req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if(!booking){
        return next(new ErrorHandler('No booking has been found for this ID', 404));
    }

    await booking.deleteOne();

    res.status(200).json({
        success:true
    });
});

exports.getPayPalClientId = catchAyncHandler(async(req, res, next) => {
    const clientId = 'Ae7n2o-GzGbRILXDK6abJJdQ2gv9qwM5nPRNSxrDYmEIjpODIvrYd_A_zr2jztw01JVEhvvBxCg7KGk2';

    res.status(200).json({
        success:true,
        clientId
    });
});

exports.deleteSingleBookingUser = catchAyncHandler(async(req, res, next) => {

    const booking = await Booking.findById(req.params.id);

    if(!booking){
        return next(new ErrorHandler('No booking has been found for this ID', 404));
    }

    await booking.deleteOne();

    res.status(200).json({
        success:true,
    });
});