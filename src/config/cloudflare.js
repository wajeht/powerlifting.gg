import './env.js';

export const cloudflare = Object.freeze({
	api_key: process.env.CLOUDFLARE_PURGE_CACHE_API_KEY,
	zone_id: process.env.CLOUDFLARE_POWERLIFTINGDOTGG_ZONE_ID,
	email: process.env.CLOUDFLARE_EMAIL,
});
