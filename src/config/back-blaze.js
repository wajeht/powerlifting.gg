import './env.js';

export const backBlaze = {
	bucket: process.env.BACKBLAZE_BUCKET,
	region: process.env.BACKBLAZE_REGION,
	end_point: process.env.BACKBLAZE_END_POINT,
	key_id: process.env.BACKBLAZE_KEY_ID,
	application_key: process.env.BACKBLAZE_APPLICATION_KEY,
};
