const express = require('express');
const router = express.Router();

const { capturePayment, verifyPayment, razorpayWebhook } = require('../controllers/payments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifyPayment', auth, isStudent, verifyPayment); // You can eventually phase this frontend verification out

// Add the webhook route (Notice there is no 'auth' middleware here, Razorpay server acts as the client)
router.post('/webhook', razorpayWebhook);

module.exports = router;
