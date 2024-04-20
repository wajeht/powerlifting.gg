import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { backupDatabase } from './backup-database.js';

const queueName = 'scheduleBackupDatabaseQueue';

export const scheduleBackupDatabaseQueue = new Queue(queueName, {
	connection: redis,
});

const processScheduleBackupDatabaseJob = async (job) => {
	try {
		job.log('database backup was started');
		await backupDatabase(job);
		job.log('database backup job was finished');
		return true;
	} catch (error) {
		job.log('database backup job failed');
	}
};

new Worker(queueName, processScheduleBackupDatabaseJob, { connection: redis });

export async function scheduleBackupDatabaseJob() {
	// await scheduleBackupDatabaseQueue.add('scheduleBackupDatabaseJob', {}, { repeat: { cron: '0 * * * *' } });
	await scheduleBackupDatabaseQueue.add('backupJob', {}, { repeat: { cron: '*/5 * * * * *' } }); // Run every 10 seconds
}
