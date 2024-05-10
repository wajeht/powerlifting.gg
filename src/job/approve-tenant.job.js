import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendApproveTenantEmail } from '../emails/email.js';

const queueName = 'sendApproveTenantEmailQueue';

export const sendApproveTenantEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendApproveTenantEmailJob = async (job) => {
	try {
		job.updateProgress(0);
		await sendApproveTenantEmail({ tenant: job.data.tenant, coach: job.data.coach });
		job.updateProgress(100);
		logger.info(`Approve Tenant email job sent`);
	} catch (error) {
		logger.error(`Failed to send Approve Tenant email job`, error);
	}
};

new Worker(queueName, processSendApproveTenantEmailJob, { connection: redis });

export async function sendApproveTenantEmailJob(data) {
	await sendApproveTenantEmailQueue.add('sendApproveTenantEmailJob', data);
}
