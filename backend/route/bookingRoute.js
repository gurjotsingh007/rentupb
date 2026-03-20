const express = require('express');
const { isUserIsAuthenticated, authorizeRoles } = require('../middleware/auth');
const { createBooking, getAllBookedHousesByIndividual, updateBookingStatus, deleteBooking, getAllBookingsByAdmin, getSingleBookedHouseByIndividual, getPayPalClientId, deleteSingleBookingUser } = require('../controller/bookingController');
const router = express.Router();

router.route('/booking-house').post(isUserIsAuthenticated, createBooking);
router.route('/booking/:id').get(isUserIsAuthenticated, getSingleBookedHouseByIndividual);
router.route('/api/orders/pay/:id').put(isUserIsAuthenticated, updateBookingStatus);
router.route('/get-all-booked-houses/:id').get(isUserIsAuthenticated, getAllBookedHousesByIndividual);
router.route('/api/config/paypal').get(isUserIsAuthenticated, getPayPalClientId);

router.route('/delete-booking/:id').delete(isUserIsAuthenticated, deleteSingleBookingUser);

router.route('/admin/get-all-booking-details').get(isUserIsAuthenticated, authorizeRoles('admin'), getAllBookingsByAdmin);
router.route('/admin/booking/:id')
.delete(isUserIsAuthenticated, authorizeRoles('admin'), deleteBooking);

module.exports = router;