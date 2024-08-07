import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendNewsLetterEmailInBulk } from './utils/newsletter.js';

const queueName = 'sendNewsletterEmailQueue';

export const sendNewsletterEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendNewsletterEmailJob = async (job) => {
	try {
		await sendNewsLetterEmailInBulk(job);
	} catch (error) {
		logger.alert(`Failed to send newsletter email job`, error);
	}
};

new Worker(queueName, processSendNewsletterEmailJob, { connection: redis });

export async function sendNewsletterEmailJob() {
	await sendNewsletterEmailQueue.add(
		'sendNewsletterEmailJob',
		{},
		{
			repeat: {
				cron: '0 9 * * *', // every day at 9 AM
			},
		},
	);
	// await sendNewsletterEmailQueue.add('sendNewsletterEmailJob', {}, {});
}
