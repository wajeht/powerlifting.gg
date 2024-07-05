import { cloudflare as cloudflareConfig } from '../config/cloudflare.js';
import { clearCloudflareCache } from './utils/clear-cloudflare-cache.js';
import { logger } from '../utils/logger.js';
import { redis } from '../database/db.js';
import { session as sessionConfig } from '../config/session.js';

export async function clear(option) {
	const { cloudflareCache, allCache, redisCache } = option;

	try {
		if (cloudflareCache) {
			await clearCloudflareCache({
				zoneId: cloudflareConfig.zone_id,
				apiToken: cloudflareConfig.api_key,
			});
			logger.info('cloudflare cache has been cleared');
		}

		if (redisCache) {
			const keys = await redis.keys('*');
			for (const key of keys) {
				// dont flush session data so we web deploy new version
				// it does not logout current users
				//
				// only flash `cached` questions
				if (!key.startsWith('bull:') && !key.startsWith(sessionConfig.store_prefix)) {
					await redis.del(key);
				}
			}
			logger.info('redis cache has been cleared');
		}

		if (allCache) {
			logger.info('all cache clear function called');
		}

		return process.exit(0);
	} catch (error) {
		const message = error.response.data.errors.map((e) => e.message).join(' ');
		logger.error(message);
		return process.exit(1);
	}
}
