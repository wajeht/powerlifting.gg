import { logger } from './utils/logger.js';
import { NotFoundError } from './app.errors.js';
import { db } from './database/db.js';
import { env } from './conifg/env.js';

export function rateLimitHandler(req, res, next) {
	if (req.get('Content-Type') === 'application/json') {
		return res.json({ message: 'Too many requests, please try again later.' });
	}
	return res.status(429).render('./rate-limit.html');
}

export async function tenantHandler(req, res, next) {
	try {
		const subdomain = req.hostname.split('.')[0];

		// test this for prod
		if (subdomain === 'localhost') {
			return next();
		}

		const [teannt] = await db.select('*').from('tenants').where({ slug: subdomain });

		if (!teannt) {
			throw new NotFoundError();
		}

		req.tenant = teannt;
		req.subdomain = subdomain;
		return next();
	} catch (error) {
		next(error);
	}
}

export function localVariables(req, res, next) {
	res.locals.app = {
		env: env.env,
	};
	return next();
}

export function notFoundHandler(req, res, next) {
	return res.status(404).render('./not-found.html');
}

export function errorHandler(err, req, res, next) {
	const error =
		process.env.NODE_ENV === 'production' ? 'oh no, something went wrong!' : err.message;
	logger.error(error);
	return res.status(500).render('error.html', { error });
}
