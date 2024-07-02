import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { generateOgImage } from './utils/generate-og-image.js';
import { logger } from '../utils/logger.js';

const queueName = 'generateOgImageQueue';

export const generateOgImageQueue = new Queue(queueName, {
	connection: redis,
});

const processGenerateOgImageJob = async (job) => {
	try {
		logger.info('generate og image job was started');
		await generateOgImage({ tenant: job.data.tenant, job });
		logger.info('generate og image job job was finished');
	} catch (error) {
		logger.error('generate og image job failed');
	}
};

new Worker(queueName, processGenerateOgImageJob, { connection: redis });

export async function generateOgImageJob(data) {
	await generateOgImageQueue.add('generateOgImageJob', data);
}
