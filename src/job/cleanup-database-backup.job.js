import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { cleanupDatabaseBackup } from './utils/cleanup-database-backup.js';
import { logger } from '../utils/logger.js';

const queueName = 'cleanupDatabaseBackupQueue';

export const cleanupDatabaseBackupQueue = new Queue(queueName, {
	connection: redis,
});

const processCleanupDatabaseBackupJob = async (job) => {
	try {
		logger.info('clean up database backup job was started');
		await cleanupDatabaseBackup({ job, amount: job.data.amount });
		logger.info('clean up database backup job job was finished');
	} catch (error) {
		logger.error('clean up database backup job failed');
	}
};

new Worker(queueName, processCleanupDatabaseBackupJob, { connection: redis });

export async function cleanupDatabaseBackupJob(data) {
	await cleanupDatabaseBackupQueue.add('cleanupDatabaseBackupJob', data);
}
