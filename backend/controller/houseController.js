const catchAyncHandler = require("../middleware/catchAyncHandler");
const ErrorHandler = require('../util/errorHandler')
const House = require('../model/houseModel');
const ApiFeature = require("../util/apiFeaturing");
const cloudinary = require('cloudinary');
const User = require('../model/userModel');
//change it products
exports.createHouse = catchAyncHandler(async (req, res, next) => {
    //Handle Images
    let images = req.body.images;
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "houses",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        } catch (error) {
            console.log('error');
        }
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const house = await House.create(req.body);
    res.status(200).json({
        success: true,
        house
    });
});

exports.getAllHouseData = catchAyncHandler(async (req, res, next) => {
    const resultPerPage = 8;
    const houseCount = await House.countDocuments();

    const apiFeature = new ApiFeature(House.find(), req.query)
        .search().category().bhk().constructionStatus().postedBy().pagenation(resultPerPage).filter();

    // let apiFeature = new ApiFeature(House.find(), req.query)
    // .search().allFilters().pagenation(resultPerPage);.filter()

    let houses = await apiFeature.query;

    // const apiFeature2 = new ApiFeature(houses, req.query).filter();

    // houses = await apiFeature2.query;

    const filterHousesLength = houses.length;

    if (!houses) {
        return next(new ErrorHandler('No houses found', 404));
    }
    res.status(200).json({
        success: true,
        houses,
        houseCount,
        filterHousesLength,
        resultPerPage
    });
});

exports.updateHouseData = catchAyncHandler(async (req, res, next) => {
    const house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House with id = ${req.params.id} is not in present database`));
    }
    let images = req.body.images;

    if (images) {
        for (let i = 0; i < house.images.length; i++) {
            await cloudinary.v2.uploader.destroy(house.images[i].public_id);
        }

        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            try {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "houses",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.log('error');
            }
        }

        req.body.images = imagesLinks;
    }
    const updatedData = await House.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
    });
});

exports.deleteHouseData = catchAyncHandler(async (req, res, next) => {
    const house = await House.findById(req.params.id);
    if (!house) {
        return next(new ErrorHandler(`House with id = ${req.params.id} is not present in database`))
    }
    //Deleting images from cloudinary
    for (let i = 0; i < house.images.length; i++) {
        await cloudinary.v2.uploader.destroy(house.images[i].public_id);
    }
    await house.deleteOne();
    res.status(200).json({
        success: true,
        message: 'House Data Successfully Deleted'
    });
});

exports.deleteHouseDataByUser = catchAyncHandler(async (req, res, next) => {
    const house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House with id = ${req.params.id} is not present in the database`));
    }
    if (req.user && house.user.toString() === req.user._id.toString()) {
        for (let i = 0; i < house.images.length; i++) {
            await cloudinary.v2.uploader.destroy(house.images[i].public_id);
        }
        await house.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'House Data Successfully Deleted',
        });
    } else {
        return next(new ErrorHandler('You are not authorized to delete this house', 403));
    }
});

exports.getSingleHouseDetail = catchAyncHandler(async (req, res, next) => {
    console.log('yes');
    const house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House with id = ${req.params.id} is not present in database`))
    }

    res.status(200).json({
        success: true,
        house
    });
});

exports.getAllHouseDataForAdmin = catchAyncHandler(async (req, res, next) => {
    const houses = await House.find();

    if (!houses) {
        return next(new ErrorHandler('No houses found', 404));
    }

    res.status(200).json({
        success: true,
        houses
    });
});

exports.getAllCities = catchAyncHandler(async (req, res, next) => {
    const cities = await House.find({}, 'title');

    const uniqueCities = [];
    const cityTitles = new Set();

    cities.forEach((city) => {
        const lowerCaseTitle = city.title.toLowerCase();
        if (!cityTitles.has(lowerCaseTitle)) {
            cityTitles.add(lowerCaseTitle);
            uniqueCities.push(city);
        }
    });

    res.status(200).json({
        success: true,
        cities: uniqueCities,
    });
});

exports.getTop6Houses = catchAyncHandler(async (req, res, next) => {
    const houses = await House.find().sort({ created_at: -1 }).limit(6);

    if (!houses || houses.length === 0) {
        return next(new ErrorHandler('No houses found', 404));
    }

    res.status(200).json({
        success: true,
        houses
    });
})

exports.getMyListings = catchAyncHandler(async (req, res, next) => {
    const houses = await House.find();

    if (!houses) {
        return next(new ErrorHandler('No houses found', 404));
    }

    const userId = req.params.id;

    const user = await User.findById(req.params.id);

    const houseEntriesBysingleUser = houses.filter((house) => {
        return house.user.toString() === userId;
    });

    if (!houseEntriesBysingleUser) {
        return next(new ErrorHandler(`No houses found for ${user.name}`, 404));
    }

    res.status(200).json({
        success: true,
        houses: houseEntriesBysingleUser
    });
});

exports.createHouseReview = catchAyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    const house = await House.findById(req.params.id);
    if(!house){
        return next(new ErrorHandler(`No houses found`, 404)); 
    }
    if (house) {
        const existingReviewIndex = house.reviews.findIndex(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (existingReviewIndex !== -1) {
            // Update existing review
            house.reviews[existingReviewIndex].rating = Number(rating);
            house.reviews[existingReviewIndex].comment = comment;

            // Update overall rating
            house.rating = house.reviews.reduce((acc, item) => item.rating + acc, 0) / house.reviews.length;

            await house.save();

            return res.status(200).json({ message: 'Review updated' });
        }
        // Create new review
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        house.reviews.push(review);

        house.numReviews = house.reviews.length;

        house.rating = house.reviews.reduce((acc, item) => acc + item.rating, 0) / house.reviews.length
        await house.save();

        return res.status(201).json({ message: 'Review added' });
    } else {
        return next(new ErrorHandler('House data is not present', 404));
    }
});

exports.deleteHouseReview = catchAyncHandler(async (req, res, next) => {
    const houseId = req.body.houseId;
    const reviewId = req.body.reviewId;
    const house = await House.findById(houseId);

    if (!house) {
        return next(new ErrorHandler('House not found', 404));
    }
    const reviewIndex = house.reviews.findIndex(review => review._id.toString() === reviewId);

    if (reviewIndex === -1) {
        return next(new ErrorHandler('Review not found', 404));
    }

    // Remove the review from the array 
    house.reviews.splice(reviewIndex, 1);
    house.numReviews = house.reviews.length;

    if (house.reviews.length === 0) {
        house.rating = 0;
    }
    else {
        house.rating = house.reviews.reduce((acc, item) => acc + item.rating, 0) / house.reviews.length;
    }
    await house.save();

    res.status(200).json({ message: 'Review deleted successfully' });
});