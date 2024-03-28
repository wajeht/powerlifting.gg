import './env.js';

export const redis = {
	port: process.env.REDIS_PORT,
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD,
};
