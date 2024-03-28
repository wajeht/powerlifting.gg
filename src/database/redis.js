import { logger } from '../utils/logger.js';
import { redis as redisConfig } from '../conifg/redis.js';
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

let redis;

if (process.env.NODE_ENV === 'testing') {
	redis = new RedisMock();
} else {
	const redisOptions = {
		port: redisConfig.port,
		host: redisConfig.host,
		password: redisConfig.password,
		maxRetriesPerRequest: null,
	};
	redis = new Redis(redisOptions);

	redis.on('error', (error) => {
		logger.error('Error initializing Redis:', error);
		process.exit(1);
	});
}

export { redis };
