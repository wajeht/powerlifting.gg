
import { cloudflare as cloudflareConfig } from '../config/cloudflare.js'
import { clearCloudflareCache } from './utils/clear-cloudflare-cache.js';
import { logger } from '../utils/logger.js'

export async function clear(option) {
  const { cloudflare_cache } = option;

  if (cloudflare_cache) {
    try {

      await clearCloudflareCache({
        zoneId: cloudflareConfig.POWERLIFTINGDOTGG_ZONE_ID,
        apiToken: cloudflareConfig.PURGE_CACHE_API_KEY
      });

      logger.info('Cache cleared');
    } catch (error) {
      const message = error.response.data.errors.map(e => e.message).join(' ')
      logger.error(message);
    }
  }
}