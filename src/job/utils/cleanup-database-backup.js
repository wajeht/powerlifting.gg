import path from 'node:path';
import fs from 'node:fs/promises';
import { logger } from '../../utils/logger.js';

export async function cleanupDatabaseBackup({ job, amount = 5 }) {
	job.updateProgress(0);

	const backupFolder = path.resolve(path.join(process.cwd(), 'src', 'database', 'backup'));

	const backups = [];

	try {
		const files = await fs.readdir(backupFolder);

		for (const file of files) {
			if (file.endsWith('.sqlite.gz')) {
				const filePath = path.join(backupFolder, file);
				backups.push({ file, path: filePath });
			}
		}

		job.updateProgress(50);

		backups.sort((a, b) => b.file.localeCompare(a.file));

		job.updateProgress(75);

		const backupsToDelete = backups.slice(amount);

		for (const backup of backupsToDelete) {
			try {
				await fs.unlink(backup.path);
				logger.info(`Deleted old backup file: ${backup.file}`);
			} catch (deleteError) {
				logger.error(`Error deleting backup file ${backup.file}:`, deleteError);
			}
		}

		job.updateProgress(100);
	} catch (error) {
		logger.error('Error reading backup folder:', error);
	}
}
