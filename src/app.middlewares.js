import { logger } from './utils/logger.js';
import { db } from './database/db.js';
import { env } from './conifg/env.js';
import {
	HttpError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
	UnimplementedFunctionError,
} from './app.errors.js';

export function rateLimitHandler(req, res) {
	if (req.get('Content-Type') === 'application/json') {
		return res.json({ message: 'Too many requests, please try again later.' });
	}
	return res.status(429).render('./rate-limit.html');
}

export async function tenantHandler(req, res, next) {
	try {
		const subdomain = req.subdomains.length ? req.subdomains[0] : null;

		if (!subdomain) {
			return next();
		}

		const tenant = await db.select('*').from('tenants').where({ slug: subdomain }).first();

		if (!tenant) {
			throw new NotFoundError();
		}

		req.tenant = tenant;
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
			env.env === 'production'
				? `https://${env.production_app_url}`
				: `http://${env.development_app_url}`,
		configureDomain: (subdomain) => {
			if (env.env === 'production') {
				return `https://${subdomain}.${env.production_app_url}`;
			}
			return `http://${subdomain}.${env.development_app_url}`;
		},
	};

	return next();
}

export async function notFoundHandler(req, res, _next) {
	const subdomain = req.subdomains.length ? req.subdomains[0] : null;

	if (!subdomain) {
		return res.status(404).render('./not-found.html');
	}

	const tenant = await db.select('*').from('tenants').where({ slug: subdomain }).first();

	return res.status(404).render('./not-found.html', {
		tenant: JSON.stringify(tenant),
		layout: '../layouts/tenant.html',
	});
}

export function errorHandler(err, req, res, _next) {
	const errorStatusCodes = {
		HttpError: new HttpError().statusCode,
		NotFoundError: new NotFoundError().statusCode,
		ForbiddenError: new ForbiddenError().statusCode,
		UnauthorizedError: new UnauthorizedError().statusCode,
		ValidationError: new ValidationError().statusCode,
		UnimplementedFunctionError: new UnimplementedFunctionError().statusCode,
	};

	let statusCode = errorStatusCodes[err.constructor.name] || 500;

	logger.error(err);

	let errorMessage =
		process.env.NODE_ENV === 'production' ? 'Oops! Something went wrong.' : err.stack;

	if (err instanceof NotFoundError) {
		errorMessage = 'Oops! The page you are looking for cannot be found.';
	} else if (
		err instanceof ForbiddenError ||
		err instanceof ValidationError ||
		err instanceof UnauthorizedError ||
		err instanceof UnimplementedFunctionError
	) {
		errorMessage = err.message;
	}

	if (req.tenant) {
		return res.status(statusCode).render('./error.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			error: errorMessage,
			statusCode,
		});
	}

	return res.status(statusCode).render('error.html', { error: errorMessage, statusCode });
}

export async function skipOnMyIp(req, _res) {
	const myIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(', ')[0];
	return myIp == env.myIp;
}
