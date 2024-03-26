import { logger } from '../utils/logger.js';
import { env } from '../conifg/env.js';
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

let redis;

if (process.env.NODE_ENV === 'testing') {
	redis = new RedisMock();
} else {
	const redisOptions = {
		port: env.redis.port,
		host: env.redis.host,
		password: env.redis.password,
		maxRetriesPerRequest: null,
	};
	redis = new Redis(redisOptions);

	redis.on('error', (error) => {
		logger.error('Error initializing Redis:', error);
		process.exit(1);
	});
}

export { redis };
