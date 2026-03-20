const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    phoneNumber:{
        type: Number,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
    },
    guests: {
        type: Number,
    },
    housePrice: {
        type: Number,
        required: true,
    },
    taxPrice:{
        type:String,
        default:0,
        required:true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentStatus:{
        id:{
            type:String,
        },
        status:{
            type: String,
            enum: ['pending', 'completed', 'canceled'],
            default: 'pending',
        }
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    purchasingType: {
        type: String,
        required: true,
    },
    housesIds: {
        type: [String],
        required: true,
    },
    paidAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Booking', bookingSchema);