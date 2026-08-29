const { redisClient } = require('../config/redis');

// A generic Fixed-Window Rate Limiter using Redis
// limit: maximum number of requests allowed
// windowInSeconds: time window in seconds
exports.rateLimiter = (limit, windowInSeconds) => {
    return async (req, res, next) => {
        try {
            // 1. Use the user's IP address and the route URL to create a unique key
            // Example: "rate_limit:192.168.1.1:/api/v1/auth/login"
            const ip = req.ip || req.connection.remoteAddress;
            const key = `rate_limit:${ip}:${req.originalUrl}`;
            
            // 2. Increment the counter for this key. If it doesn't exist, Redis sets it to 1.
            const requests = await redisClient.incr(key);
            
            // 3. If it's the very first request, set the expiration (TTL) for this window
            if (requests === 1) {
                await redisClient.expire(key, windowInSeconds);
            }
            
            console.log(`[Rate Limiter] ${ip} has made ${requests}/${limit} requests to ${req.originalUrl}`);

            // 4. If they exceed the limit, block the request
            if (requests > limit) {
                console.log(`❌ [Rate Limiter] Blocked request from ${ip}`);
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later."
                });
            }
            
            // Otherwise, allow the request to proceed to the controller
            next();
        } catch (error) {
            console.error('Redis Rate Limiter Error:', error);
            // INTERVIEW KNOWLEDGE: Fail-open strategy! 
            // If the Redis server crashes, we don't want to completely block all valid users from logging in.
            // We just bypass the rate limit and allow them through.
            next();
        }
    }
}
