import './env.js';
import { S3Client } from '@aws-sdk/client-s3';

export const backBlaze = Object.freeze({
	private: {
		bucket: process.env.PRIVATE_BACKBLAZE_BUCKET,
		region: process.env.PRIVATE_BACKBLAZE_REGION,
		end_point: process.env.PRIVATE_BACKBLAZE_END_POINT,
		key_id: process.env.PRIVATE_BACKBLAZE_KEY_ID,
		application_key: process.env.PRIVATE_BACKBLAZE_APPLICATION_KEY,
	},
	public: {
		bucket: process.env.PUBLIC_BACKBLAZE_BUCKET,
		region: process.env.PUBLIC_BACKBLAZE_REGION,
		end_point: process.env.PUBLIC_BACKBLAZE_END_POINT,
		key_id: process.env.PUBLIC_BACKBLAZE_KEY_ID,
		application_key: process.env.PUBLIC_BACKBLAZE_APPLICATION_KEY,
	},
});

export const publicS3BucketConfig = new S3Client({
	credentials: {
		accessKeyId: backBlaze.public.key_id,
		secretAccessKey: backBlaze.public.application_key,
	},
	region: backBlaze.public.region,
	forcePathStyle: true,
	endpoint: backBlaze.public.end_point,
});

export const privateS3BucketConfig = new S3Client({
	credentials: {
		accessKeyId: backBlaze.private.key_id,
		secretAccessKey: backBlaze.private.application_key,
	},
	region: backBlaze.private.region,
	forcePathStyle: true,
	endpoint: backBlaze.private.end_point,
});
