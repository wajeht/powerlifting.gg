import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { backBlaze as backBlazeConfig } from '../config/back-blaze.js';
import { logger } from '../utils/logger.js';

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
	const sqliteFileName = 'db.sqlite';
	const sqliteFilePath = path.resolve(path.join(process.cwd(), 'src', 'database', sqliteFileName));

	try {
		const fileStream = fs.createReadStream(sqliteFilePath);

		const upload = new Upload({
			client: s3,
			params: {
				Bucket: bucketName,
				Key: sqliteFileName,
				Body: fileStream,
			},
		});

		upload.on('httpUploadProgress', (progress) => {
			const jobProgress = Math.min((progress.loaded / progress.total) * 100, 100);
			job.updateProgress(jobProgress);
		});

		await upload.done();

		logger.info('Successfully uploaded ' + sqliteFileName + ' to ' + bucketName);
	} catch (e) {
		logger.error('Error:', e);
	}
}
