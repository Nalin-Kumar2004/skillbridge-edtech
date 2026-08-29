const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

// Re-use the Upstash Redis URL
const redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

// Create the Queue
const emailQueue = new Queue('email-queue', { connection: redisConnection });

const addEmailToQueue = async (email, title, body) => {
    try {
        const job = await emailQueue.add('send-email', {
            email,
            title,
            body
        });
        console.log(`[BullMQ] Added email job to queue: ${job.id}`);
        return job;
    } catch (error) {
        console.error('[BullMQ] Error adding email to queue:', error);
    }
};

module.exports = {
    emailQueue,
    addEmailToQueue
};
