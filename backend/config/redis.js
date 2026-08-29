const { createClient } = require('redis');

// 1. Create a single Redis client instance
const redisClient = createClient({
    // We use an environment variable so it works in both local and production (AWS/Railway)
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// 2. Listen for connection events (Good for debugging)
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis successfully!'));

// 3. Create a function to establish the connection
const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('⚠️ Failed to connect to Redis:', error);
        
        // INTERVIEW KNOWLEDGE: Notice we do NOT use process.exit(1) here! 
        // If the cache goes down, the app should NOT crash. It should just fall back 
        // to querying MongoDB directly (it will be slower, but the site will stay online).
    }
};

module.exports = {
    redisClient,
    connectRedis
};
