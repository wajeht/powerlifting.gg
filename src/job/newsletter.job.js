import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendNewsletterEmail } from '../emails/email.js';

const queueName = 'sendNewsletterEmailQueue';

export const sendNewsletterEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendNewsletterEmailJob = async (job) => {
	try {
		job.updateProgress(0);
		await sendNewsletterEmail({
			email: job.data.email,
			username: job.data.username,
			post: job.data.post,
		});
		job.updateProgress(100);
		logger.info(`Newsletter email job  sent to ${job.data.email}`);
	} catch (error) {
		logger.error(`Failed to send newsletter email job to ${job.data.email}`, error);
	}
};

new Worker(queueName, processSendNewsletterEmailJob, { connection: redis });

export async function sendNewsletterEmailJob(data) {
	await sendNewsletterEmailQueue.add('sendNewsletterEmailJob', data, {
		repeat: {
			cron: '0 9 * * *', // every day at 9 AM
		},
	});
}
