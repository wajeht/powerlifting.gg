import { Queue, Worker } from 'bullmq';
import { redis } from '../database/db.js';
import { backupDatabase } from './utils/backup-database.js';

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
	// TODO: change this back to every 1 hour when site is live
	await scheduleBackupDatabaseQueue.add(
		'scheduleBackupDatabaseJob',
		{},
		{ repeat: { cron: '0 */6 * * *' } },
	); // every 6 hours
	// await scheduleBackupDatabaseQueue.add('scheduleBackupDatabaseJob', {}, { repeat: { cron: '0 * * * *' } }); // every hour
	// await scheduleBackupDatabaseQueue.add('scheduleBackupDatabaseJob', {}, { repeat: { cron: '*/5 * * * * *' } }); // every 10 seconds
}
