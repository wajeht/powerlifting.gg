import './env.js';

export const sentry = Object.freeze({
	dsn: process.env.SENTRY_DSN,
});
