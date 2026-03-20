const express = require('express');
const { registerUser, loginUser, logoutUser, getUserDetail, updatePassword, updateUserProfile, getAllUsersData, getSingleUserData, updateUserRole, deleteTheGivenUser } = require('../controller/userController');
const { isUserIsAuthenticated, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/my-Information').get(isUserIsAuthenticated, getUserDetail);
router.route('/update-your-password').put(isUserIsAuthenticated, updatePassword);
router.route('/update-your-profile').put(isUserIsAuthenticated, updateUserProfile);
//Admin can access below routes
router.route('/admin/get-all-users').get(isUserIsAuthenticated, authorizeRoles('admin'), getAllUsersData);
router.route('/admin/get-single-user/:id')
.get(isUserIsAuthenticated, authorizeRoles('admin'), getSingleUserData)
.put(isUserIsAuthenticated, authorizeRoles('admin'), updateUserRole)
.delete(isUserIsAuthenticated, authorizeRoles('admin'), deleteTheGivenUser);

module.exports = router;