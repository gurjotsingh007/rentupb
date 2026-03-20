const express = require('express');
const { getAllHouseData, createHouse, getSingleHouseDetail, updateHouseData, deleteHouseData, getAllHouseDataForAdmin, getAllCities, getMyListings, deleteHouseDataByUser, getTop6Houses, createHouseReview, deleteHouseReview } = require('../controller/houseController');
const { authorizeRoles, isUserIsAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.route('/get-all-houses').get(getAllHouseData);
router.route('/get-all-cities').get(getAllCities);
router.route('/get-newly-registered-property').get(getTop6Houses);
router.route('/get-single-house-data/:id').get(isUserIsAuthenticated, getSingleHouseDetail);
router.route('/get-my-listings/:id').get(isUserIsAuthenticated, getMyListings);
router.route('/update-house/:id').put(isUserIsAuthenticated, updateHouseData);
router.route('/create-review/:id').post(isUserIsAuthenticated, createHouseReview);

//Admin Routes
router.route('/delete-review').delete(isUserIsAuthenticated, authorizeRoles('admin'), deleteHouseReview);
router.route('/create-new-house-entry').post(isUserIsAuthenticated, createHouse);
router.route('/delete-house/:id').delete(isUserIsAuthenticated, deleteHouseDataByUser);
router.route('/admin/house/:id')
.get(isUserIsAuthenticated, authorizeRoles('admin'), getSingleHouseDetail)
.put(isUserIsAuthenticated, authorizeRoles('admin'), updateHouseData)
.delete(isUserIsAuthenticated, authorizeRoles('admin'), deleteHouseData);

router.route('/admin/get-all-houses').get(isUserIsAuthenticated, authorizeRoles('admin'), getAllHouseDataForAdmin);

module.exports = router;