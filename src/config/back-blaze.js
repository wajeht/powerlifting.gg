import './env.js';

export const backBlaze = {
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
};
