import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendWelcomeEmail } from '../emails/email.js';

const queueName = 'sendWelcomeEmailQueue';

export const sendWelcomeEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processWelcomeEmailJob = async (job) => {
	try {
		await sendWelcomeEmail({
			email: job.data.email,
			username: job.data.username,
		});
		logger.info(`Welcome email job  sent to ${job.data.email}`);
	} catch (error) {
		logger.error(`Failed to send welcome email job to ${job.data.email}`, error);
	}
};

new Worker(queueName, processWelcomeEmailJob, { connection: redis });

export async function sendWelcomeEmailJob(data) {
	await sendWelcomeEmailQueue.add('welcomeEmailJob', data);
}
