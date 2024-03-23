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
		if (['localhost', 'subdomain'].includes(subdomain)) {
			return next();
		}

		const [tenant] = await db.select('*').from('tenants').where({ slug: subdomain });

		if (!tenant) {
			throw new NotFoundError();
		}

		req.tenant = tenant;
		req.subdomain = subdomain;

		res.locals.app = {
			...res.locals.app,
			tenant,
		};

		return next();
	} catch (error) {
		next(error);
	}
}

export function localVariables(req, res, next) {
	res.locals.app = {
		env: env.env,
		mainDomain:
			env.env === 'production' ? 'https://subdomain.jaw.dev' : `http://localhost:${env.port}`,
		configureDomain: (subdomain) => {
			if (env.env === 'production') {
				return `https://${subdomain}.subdomain.jaw.dev`;
			}
			return `http://${subdomain}.localhost:${env.port}`;
		},
	};

	return next();
}

export function notFoundHandler(req, res, next) {
	if (req.tenant) {
		return res.status(404).render('./not-found.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}
	return res.status(404).render('./not-found.html');
}

export function errorHandler(err, req, res, next) {
	logger.error(err);
	const error = process.env.NODE_ENV === 'production' ? 'oh no, something went wrong!' : err;
	if (req.tenant) {
		return res.status(500).render('./error.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			error,
		});
	}
	return res.status(500).render('error.html', { error });
}
