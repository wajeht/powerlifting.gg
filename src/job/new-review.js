import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendNewReviewEmail } from '../emails/email.js';

const queueName = 'sendNewReviewEmailQueue';

export const sendNewReviewEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendNewReviewEmailJob = async (job) => {
	try {
		job.updateProgress(0);
		await sendNewReviewEmail({ tenant: job.data.tenant, coach: job.data.coach });
		job.updateProgress(100);
		logger.info(`new review email job sent`);
	} catch (error) {
		logger.alert(`Failed to send new review email job`, error);
	}
};

new Worker(queueName, processSendNewReviewEmailJob, { connection: redis });

export async function sendNewReviewEmailJob(data) {
	await sendNewReviewEmailQueue.add('sendNewReviewEmailJob', data);
}
