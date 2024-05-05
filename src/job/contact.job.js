import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { sendContactEmail } from '../emails/email.js';

const queueName = 'sendContactEmailQueue';

export const sendContactEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendContactEmailJob = async (job) => {
	try {
		job.log('contact email job was started');
		await sendContactEmail({
			subject: job.data.subject,
			email: job.data.email,
			message: job.data.message,
		});
		job.log('contact email job was finished');
	} catch (error) {
		job.log('contact email job failed');
	}
};

new Worker(queueName, processSendContactEmailJob, { connection: redis });

export async function sendContactEmailJob(data) {
	await sendContactEmailQueue.add('sendContactEmailJob', data);
}
