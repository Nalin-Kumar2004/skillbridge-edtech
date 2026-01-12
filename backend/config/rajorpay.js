const Rajorpay = require('razorpay');
require('dotenv').config();

let rzpInstance = null;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
    rzpInstance = new Rajorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    })
} else {
    console.warn("⚠️ Razorpay keys not found. Payment gateway disabled (test mode only).");
}

exports.instance = rzpInstance;