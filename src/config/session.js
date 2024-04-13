import './env.js';

export const session = {
	secret: process.env.SESSION_SECRET,
	store_prefix: process.env.SESSION_STORE_PREFIX,
};
