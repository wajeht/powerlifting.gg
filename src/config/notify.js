import './env.js';

export const notify = Object.freeze({
	url: process.env.NOTIFY_URL,
	xApiKey: process.env.NOTIFY_X_API_KEY,
});
