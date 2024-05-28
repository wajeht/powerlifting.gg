import { Upload } from '@aws-sdk/lib-storage';
import { backBlaze as backBlazeConfig, privateS3BucketConfig } from '../config/back-blaze.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { app as appConfig } from '../config/app.js';

const execAsync = promisify(exec);

// TODO: make this testable
export async function backupDatabase(job) {
	if (appConfig.env !== 'production') {
		logger.info('Skipping database backup on non production environment!');
		return;
	}

	const bucketName = backBlazeConfig.private.bucket;
	const currentDate = new Date().toISOString().replace(/:/g, '-');
	const backupFileName = `db-${currentDate}.sqlite`;

	try {
		const backupCommand = `sqlite3 ./src/database/db.sqlite "VACUUM INTO './src/database/backup/${backupFileName}'"`;
		await execAsync(backupCommand);
		logger.info(`Backup successful: ${backupFileName}`);

		const gzipCommand = `gzip ./src/database/backup/${backupFileName}`;
		await execAsync(gzipCommand);
		logger.info(`Gzip successful: ${backupFileName}.gz`);

		const sqliteFilePath = path.resolve(
			process.cwd(),
			'src',
			'database',
			'backup',
			`${backupFileName}.gz`,
		);
		const fileStream = fs.createReadStream(sqliteFilePath);
		const upload = new Upload({
			client: privateS3BucketConfig,
			params: {
				Bucket: bucketName,
				Key: `${backupFileName}.gz`,
				Body: fileStream,
			},
		});

		upload.on('httpUploadProgress', (progress) => {
			const jobProgress = Math.min((progress.loaded / progress.total) * 100, 100);
			job.updateProgress(jobProgress);
		});

		await upload.done();

		logger.info(`Successfully uploaded ${backupFileName}.gz to ${bucketName}`);
	} catch (error) {
		logger.alert('Error:', error);
	}
}
