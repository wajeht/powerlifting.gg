import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendContactEmail } from '../emails/email.js';

const queueName = 'sendContactEmailQueue';

export const sendContactEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processContactEmailJob = async (job) => {
	try {
		await sendContactEmail({
			email: job.data.email,
			message: job.data.message,
		});
		logger.info(`contact email job  sent to ${job.data.email}`);
	} catch (error) {
		logger.error(`Failed to send contact email job to ${job.data.email}`, error);
	}
};

new Worker(queueName, processContactEmailJob, { connection: redis });

export async function sendContactEmailJob(data) {
	await sendContactEmailQueue.add('contactEmailJob', data);
}
