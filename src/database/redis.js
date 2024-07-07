import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

import { logger } from '../utils/logger.js';
import { redis as redisConfig } from '../config/redis.js';

let redis;

const redisOptions = {
	port: redisConfig.port,
	host: redisConfig.host,
	password: redisConfig.password,
	maxRetriesPerRequest: null,
};

if (process.env.NODE_ENV === 'testing') {
	redis = new RedisMock(redisOptions);
} else {
	redis = new Redis(redisOptions);
}

redis.on('error', (error) => {
	logger.alert('Error initializing Redis:', error);
	process.exit(1);
});

export { redis };
