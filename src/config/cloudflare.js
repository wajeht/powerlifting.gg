import './env.js';

export const cloudflare = Object.freeze({
  PURGE_CACHE_API_KEY: process.env.CLOUDFLARE_PURGE_CACHE_API_KEY,
  POWERLIFTINGDOTGG_ZONE_ID: process.env.CLOUDFLARE_POWERLIFTINGDOTGG_ZONE_ID,
  EMAIL: process.env.CLOUDFLARE_EMAIL,
});
