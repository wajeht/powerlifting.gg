import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { calibrateRatings } from './utils/calibrate-ratings.js';

const queueName = 'calibrateRatingsQueue';

export const calibrateRatingsQueue = new Queue(queueName, {
	connection: redis,
});

const processCalibrateRatingsJob = async (job) => {
	try {
		job.log('calibrate ratings job was started');
		await calibrateRatings({ ids: job.data.ids });
		job.log('calibrate ratings job job was finished');
		return true;
	} catch (error) {
		job.log('calibrate ratings job job failed');
	}
};

new Worker(queueName, processCalibrateRatingsJob, { connection: redis });

export async function calibrateRatingsJob(data) {
	await calibrateRatingsQueue.add('calibrateRatingsJob', data);
}
