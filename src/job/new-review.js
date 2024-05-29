import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { sendNewReviewEmail } from '../emails/email.js';
import { db } from '../database/db.js';

const queueName = 'sendNewReviewEmailQueue';

export const sendNewReviewEmailQueue = new Queue(queueName, {
	connection: redis,
});

const processSendNewReviewEmailJob = async (job) => {
	try {
		job.updateProgress(0);
		const user = await db.select('*').from('users').where({ id: job.data.user_id }).first();
		const subscription = await db
			.select('*')
			.from('subscriptions')
			.where({ email: user.email })
			.first();

		const subscriptionInfo = JSON.parse(subscription.type);
		const subscribedTenant = subscriptionInfo.tenants.find((t) => t.subscribed && t.id === job.data.tenant_id); // prettier-ignore

		if (subscribedTenant) {
			const tenant = await db.select('*').from('tenants').where({ id: job.data.tenant_id }).first();
			await sendNewReviewEmail({
				tenant,
				user,
				review: job.data.review,
			});
			job.updateProgress(100);
			logger.info(`new review email job sent`);
		} else {
			logger.info(`Tenant with ID ${job.data.tenant_id} is not subscribed or does not exist`);
			job.updateProgress(100);
		}
	} catch (error) {
		logger.alert(`Failed to send new review email job`, error);
	}
};

new Worker(queueName, processSendNewReviewEmailJob, { connection: redis });

export async function sendNewReviewEmailJob(data) {
	await sendNewReviewEmailQueue.add('sendNewReviewEmailJob', data);
}
