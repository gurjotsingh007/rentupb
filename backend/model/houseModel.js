const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
);

const houseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    amenities: {
        type: [String],
        required: true,
    },
    constructionStatus: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    opProperty: {
        type: String,
        required: true
    },
    bhk: {
        type: String,
        required: true
    },
    images:[
        {
            public_id:{
            type:String,
            required:true
            },
            url:{
                type:String,
                required:true
            }
        },
    ],
    available: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('House', houseSchema);