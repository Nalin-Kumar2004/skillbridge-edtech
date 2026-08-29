const express = require('express');
const router = express.Router();

// Controllers
const {
    signup,
    login,
    sendOTP,
    changePassword
} = require('../controllers/auth');

// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/resetPassword');


// Middleware
const { auth, isAdmin } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');
const { getAllStudents, getAllInstructors } = require('../controllers/profile');


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup (Max 5 signups per hour per IP)
router.post('/signup', rateLimiter(5, 3600), signup);

// Route for user login (Max 5 login attempts per minute per IP to prevent brute-force)
router.post('/login', rateLimiter(5, 60), login);

// Route for sending OTP to the user's email (Max 3 OTPs per 5 minutes per IP to prevent email spam)
router.post('/sendotp', rateLimiter(3, 300), sendOTP);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);



// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


// ********************************************************************************************************
//                                     Only for Admin - getAllStudents & getAllInstructors
// ********************************************************************************************************

router.get("/all-students", auth, isAdmin, getAllStudents)
router.get("/all-instructors", auth, isAdmin, getAllInstructors)



module.exports = router
