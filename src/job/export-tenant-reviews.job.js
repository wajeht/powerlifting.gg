import { Queue, Worker } from 'bullmq';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { exportTenantReviews } from './utils/export-tenant-reviews.js';

const queueName = 'exportTenantReviewsQueue';

export const exportTenantReviewsQueue = new Queue(queueName, {
	connection: redis,
});

const processExportTenantReviewsJob = async (job) => {
	try {
		logger.info('calibrate ratings job was started');
		await exportTenantReviews({ job, tenant_id: job.data.tenant_id });
		logger.info('calibrate ratings job job was finished');
	} catch (error) {
		logger.error('calibrate ratings job job failed');
	}
};

new Worker(queueName, processExportTenantReviewsJob, { connection: redis });

export async function exportTenantReviewsJob(data) {
	await exportTenantReviewsQueue.add('exportTenantReviewsJob', data);
}
