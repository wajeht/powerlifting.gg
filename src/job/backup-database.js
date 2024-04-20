import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { backBlaze as backBlazeConfig } from '../config/back-blaze.js';

export async function backupDatabase() {
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

		const params = {
			Bucket: bucketName,
			Key: sqliteFileName,
			Body: fileStream,
		};

		await s3.send(new PutObjectCommand(params));

		logger.info('Successfully uploaded ' + sqliteFileName + ' to ' + bucketName);
	} catch (err) {
		logger.error('Error:', err);
	}
}
