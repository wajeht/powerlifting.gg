import './env.js';

export const redis = Object.freeze({
	port: process.env.REDIS_PORT,
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
});
