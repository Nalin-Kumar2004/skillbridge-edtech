const { Worker } = require('bullmq');
const Redis = require('ioredis');
const mailSender = require('../utils/mailSender');
require('dotenv').config();

// Re-use the Upstash Redis URL
const redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

console.log('[BullMQ] Email worker initialized and listening for jobs...');

const emailWorker = new Worker(
    'email-queue',
    async (job) => {
        const { email, title, body } = job.data;
        console.log(`[BullMQ] Processing job ${job.id}: Sending email to ${email}`);
        
        try {
            await mailSender(email, title, body);
            console.log(`[BullMQ] Job ${job.id} completed successfully.`);
        } catch (error) {
            console.error(`[BullMQ] Job ${job.id} failed:`, error);
            throw error; // Let BullMQ handle retries
        }
    },
    { connection: redisConnection }
);

emailWorker.on('failed', (job, err) => {
    console.error(`[BullMQ] Job ${job.id} failed with reason: ${err.message}`);
});

module.exports = emailWorker;
