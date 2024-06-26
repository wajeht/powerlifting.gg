import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendWelcomeEmail } from '../emails/email.js';

const queueName = 'sendWelcomeEmailQueue';

export const sendWelcomeEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendWelcomeEmailJob = async (job) => {
	try {
		job.updateProgress(0);
		await sendWelcomeEmail({ email: job.data.email, username: job.data.username });
		job.updateProgress(100);
		logger.info(`Welcome email job  sent to ${job.data.email}`);
	} catch (error) {
		logger.alert(`Failed to send welcome email job to ${job.data.email}`, error);
	}
};

new Worker(queueName, processSendWelcomeEmailJob, { connection: redis });

export async function sendWelcomeEmailJob(data) {
	await sendWelcomeEmailQueue.add('sendWelcomeEmailJob', data);
}
