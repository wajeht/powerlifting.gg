import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { backBlaze as backBlazeConfig } from '../config/back-blaze.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function backupDatabase(job) {
	const s3 = new S3Client({
		credentials: {
			accessKeyId: backBlazeConfig.key_id,
			secretAccessKey: backBlazeConfig.application_key,
		},
		region: backBlazeConfig.region,
		forcePathStyle: true,
		endpoint: backBlazeConfig.end_point,
	});

	const bucketName = backBlazeConfig.bucket;
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
			client: s3,
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
		logger.error('Error:', error);
	}
}
