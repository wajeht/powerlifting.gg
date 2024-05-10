import './env.js';

export const session = Object.freeze({
	secret: process.env.SESSION_SECRET,
	store_prefix: process.env.SESSION_STORE_PREFIX,
});
