const express = require('express')
const app = express();

// packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// connection to DB and Redis
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

// routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');
const reachRoutes = require('./routes/reach');


// middleware
// 1. MUST GO BEFORE express.json()
// We use express.raw to preserve the exact byte stream for cryptographic hashing
app.use('/api/v1/payment/webhook', express.raw({ type: 'application/json' }));

// 2. Standard parsing for all your other routes (login, course creation, etc.)
app.use(express.json()); // to parse json body
app.use(cookieParser());

// Request logging middleware - to trace all incoming requests
app.use((req, res, next) => {
    console.log('\n====================================================');
    console.log(`📨 INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body keys:', Object.keys(req.body));
    }
    if (req.files && Object.keys(req.files).length > 0) {
        console.log('Files:', Object.keys(req.files));
    }
    console.log('====================================================\n');
    next();
});

app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
        ].filter(Boolean),
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('\n\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    console.log(`🚀 SERVER STARTED SUCCESSFULLY!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Folder Name for uploads: ${process.env.FOLDER_NAME}`);
    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n');
});

// connections
console.log('\n🔗 Initializing database connection...');
connectDB();
console.log('\n⚡ Initializing Redis connection...');
connectRedis();

console.log('\n👷 Starting BullMQ Background Workers...');
require('./workers/emailWorker');
// mount route
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/reach', reachRoutes);




// Default Route
app.get('/', (req, res) => {
    // console.log('Your server is up and running..!');
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
})