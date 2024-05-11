// import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
// import { backBlaze as backBlazeConfig } from '../config/back-blaze.js';
// import { logger } from '../utils/logger.js';

// const s3 = new S3Client({
// 	credentials: {
// 		accessKeyId: backBlazeConfig.key_id,
// 		secretAccessKey: backBlazeConfig.application_key,
// 	},
// 	region: backBlazeConfig.region,
// 	forcePathStyle: true,
// 	endpoint: backBlazeConfig.end_point,
// });

// export async function main() {
// 	const bucketName = backBlazeConfig.bucket;

// 	try {
// 		const command = new ListObjectsV2Command({
// 			Bucket: bucketName,
// 		});

// 		const response = await s3.send(command);

// 		console.table(response.Contents);
// 	} catch (error) {
// 		logger.error('Error listing uploaded files:', error);
// 		throw error;
// 	}
// }

// main();
