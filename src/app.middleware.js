import helmet from 'helmet';
import session from 'express-session';
import multerS3 from 'multer-s3';
import multer from 'multer';
import connectRedis from 'connect-redis';
// import rateLimitRedis from 'rate-limit-redis';

import { csrfSync } from 'csrf-sync';
import { validationResult } from 'express-validator';
import { db } from './database/db.js';
import { app as appConfig } from './config/app.js';
import { backBlaze as backBlazeConfig, publicS3BucketConfig } from './config/back-blaze.js';
import { rateLimit } from 'express-rate-limit';
import { redis } from './database/db.js';
import { session as sessionConfig } from './config/session.js';
import { alertDiscord } from './utils/discord.js';
import {
	HttpError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
	UnimplementedFunctionError,
} from './app.error.js';
import { cloudflare as cloudflareConfig } from './config/cloudflare.js';

const sessionRedisStore = new connectRedis({
	client: redis,
	prefix: sessionConfig.store_prefix,
	disableTouch: true,
});

// const rateLimitRedisStore = new rateLimitRedis({
// 	sendCommand: (...args) => redis.call(...args),
// })

export const uploadHandler = multer({
	storage: multerS3({
		s3: publicS3BucketConfig,
		bucket: backBlazeConfig.public.bucket,
		acl: 'public-read',
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			const fileExtension = file.originalname.split('.').pop();
			const key = `${Date.now().toString()}.${fileExtension}`;
			cb(null, key);
		},
	}),
	limits: { fileSize: 1024 * 1024 }, // 1MB = 1024 * 1024 bytes
});

export const authorizePermissionHandler = (role) => {
	return (req, res, next) => {
		try {
			if (req.session && req.session.user.role !== role) {
				throw new UnauthorizedError();
			}
			next();
		} catch (e) {
			next(e);
		}
	};
};

export const validateRequestHandler = (schemas) => {
	return async (req, res, next) => {
		try {
			await Promise.all(schemas.map((schema) => schema.run(req)));
			const result = validationResult(req);
			if (result.isEmpty()) return next();
			const { errors } = result;
			const errorMessages = errors.map((error) => error.msg).join('\n');
			req.flash('error', errorMessages);
			return res.redirect('back');
		} catch (error) {
			next(error);
		}
	};
};

export const csrfHandler = (() => {
	const { csrfSynchronisedProtection } = csrfSync({
		getTokenFromRequest: (req) => req.body.csrfToken || req.query.csrfToken,
	});

	return [
		csrfSynchronisedProtection,
		(req, res, next) => {
			res.locals.csrfToken = req.csrfToken();
			next();
		},
	];
})();

export const catchAsyncErrorHandler = (fn) => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (err) {
			next(err);
		}
	};
};

export async function authenticationHandler(req, res, next) {
	try {
		const user = req.session?.user;
		if (!user) {
			if (req.tenant) {
				const tenantUrl = res.locals.app.configureDomain(res.locals.app.tenant.slug);
				req.session.redirectUrl = `${tenantUrl}${req.originalUrl}`;
			} else {
				req.session.redirectUrl = req.originalUrl;
			}
			return res.redirect('/login');
		}

		// force logout
		if (user) {
			const u = await db.select('id').from('users').where({ id: user.id }).first();
			if (!u) {
				req.session.user = undefined;
				req.session.destroy((error) => {
					if (error) {
						throw new Error(error);
					}
				});
				return res.redirect("/?alert-success=You've have been logged out!");
			}
		}

		next();
	} catch (error) {
		next(error);
	}
}

export function tenancyHandler(req, res, next) {
	try {
		if (!req.tenant) {
			throw new NotFoundError();
		}
		next();
	} catch (error) {
		next(error);
	}
}

export function throwTenancyHandler(req, res, next) {
	try {
		if (req.tenant) {
			throw new NotFoundError();
		}
		next();
	} catch (error) {
		next(error);
	}
}

export async function tenantIdentityHandler(req, res, next) {
	try {
		const subdomain = req.subdomains.length ? req.subdomains[0] : null;

		if (req.session.user) {
			res.locals.app['user'] = req.session.user;
		}

		if (!subdomain) {
			return next();
		}

		const tenant = await db
			.select('*')
			.from('tenants')
			.where({ slug: subdomain, approved: true })
			.first();

		if (!tenant) {
			throw new NotFoundError();
		}

		req.tenant = tenant;
		res.locals.app['tenant'] = tenant;

		return next();
	} catch (error) {
		next(error);
	}
}

export async function localVariables(req, res, next) {
	res.locals.app = {
		env: appConfig.env,
		copyRightYear: new Date().getFullYear(),
		cloudflare_turnstile_secret_key: cloudflareConfig.turnstile.site_key,
		// prettier-ignore
		mainDomain: appConfig.env === 'production' ? `https://${appConfig.production_app_url}` : `http://${appConfig.development_app_url}`,
		configureDomain: (subdomain) => {
			if (appConfig.env === 'production') {
				return `https://${subdomain}.${appConfig.production_app_url}`;
			}
			return `http://${subdomain}.${appConfig.development_app_url}`;
		},
	};

	const app = res.locals.app;

	const og = {
		domainWithProtocol: app.mainDomain,
		domainWithoutProtocol: app.mainDomain.replace(/https?:\/\//, ''),
		image: `${app.mainDomain}/img/crowd.jpg`,
	};

	res.locals.app.og = og;

	if (req.session.user) {
		res.locals.app['user'] = req.session.user;
		const user = req.session.user;
		const tenant = await db
			.select('*')
			.from('tenants')
			.join('coaches', 'coaches.tenant_id', 'tenants.id')
			.where({ 'coaches.user_id': user.id })
			.andWhere({ 'tenants.approved': true })
			.andWhere({ 'tenants.verified': true })
			.orderBy('tenants.created_at', 'desc')
			.first();
		if (tenant) {
			res.locals.app['user'].tenant = tenant;

			const tenantDomain = app.configureDomain(tenant.slug);
			og.domainWithProtocol = tenantDomain;
			og.domainWithoutProtocol = tenantDomain.replace(/https?:\/\//, '');

			if (tenant.banner.startsWith('https://')) {
				// straight from s3
				og.image = tenant.og_image;
			} else {
				// from our fs
				og.image = `${tenantDomain}${tenant.banner}`;
			}

			res.locals.app.og = og;
		}
	}

	return next();
}

export async function notFoundHandler(req, res, _next) {
	const subdomain = req.subdomains.length ? req.subdomains[0] : null;

	if (!subdomain) {
		return res.status(404).render('./not-found.html', {
			title: 'Not Found',
			path: `/${req.originalUrl}`,
		});
	}

	const tenant = await db.select('*').from('tenants').where({ slug: subdomain }).first();

	return res.status(404).render('./not-found.html', {
		tenant,
		title: 'Not Found',
		path: `/${req.originalUrl}`,
		layout: '../layouts/tenant.html',
	});
}

export async function errorHandler(err, req, res, _next) {
	if (appConfig.env !== 'testing') {
		// NOTE: skip 404 errors
		if (!(err instanceof NotFoundError)) {
			await alertDiscord(err.message, err.stack);
		}
	}

	const errorStatusCodes = {
		HttpError: new HttpError().statusCode,
		NotFoundError: new NotFoundError().statusCode,
		ForbiddenError: new ForbiddenError().statusCode,
		UnauthorizedError: new UnauthorizedError().statusCode,
		ValidationError: new ValidationError().statusCode,
		UnimplementedFunctionError: new UnimplementedFunctionError().statusCode,
	};

	let statusCode = errorStatusCodes[err.constructor.name] || 500;

	let errorMessage = 'Oops! Something went wrong.';

	if (process.env.NODE_ENV === 'production') {
		if (req.user && req.user.role === 'SUPER_ADMIN') {
			errorMessage = err.stack;
		}
	} else if (process.env.NODE_ENV === 'development') {
		errorMessage = err.stack;
	}

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
			title: 'Error',
			path: `/${req.originalUrl}`,
			tenant: req.tenant,
			layout: '../layouts/tenant.html',
			error: errorMessage,
			statusCode,
		});
	}

	return res.status(statusCode).render('error.html', {
		error: errorMessage,
		statusCode,
		title: 'Error',
		path: `/${req.originalUrl}`,
	});
}

export function rateLimitHandler(getIpAddress) {
	return rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		// store: rateLimitRedisStore,
		handler: (req, res) => {
			if (req.get('Content-Type') === 'application/json') {
				return res.json({ message: 'Too many requests, please try again later.' });
			}
			return res.status(429).render('./rate-limit.html');
		},
		skip: (req, _res) => {
			const myIp = getIpAddress(req);
			return myIp == appConfig.myIp || process.env.NODE_ENV === 'development';
		},
	});
}

export function helmetHandler() {
	return helmet({
		contentSecurityPolicy: {
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				'default-src': [
					"'self'",
					'plausible.jaw.dev',
					'*.powerlifting.gg',
					'localtest.me',
					'*.jaw.lol',
				],
				'script-src': [
					"'self'",
					"'unsafe-inline'",
					"'unsafe-eval'",
					'plausible.jaw.dev',
					'*.powerlifting.gg',
					'localtest.me',
					'*.jaw.lol',
					'text/javascript',
					'blob:',
					'https://jaw.dev',
					'https://challenges.cloudflare.com',
				],
				'script-src-elem': [
					"'self'",
					"'unsafe-inline'",
					'https://plausible.jaw.dev',
					'https://challenges.cloudflare.com',
				],
				'script-src-attr': ["'self'", "'unsafe-inline'"],
				'img-src': [
					"'self'",
					'https://lh3.googleusercontent.com',
					'https://s3.us-east-005.backblazeb2.com',
					'data:',
					'blob:',
				],
				'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
				'connect-src': [
					"'self'",
					'plausible.jaw.dev',
					'*.powerlifting.gg',
					'https://*.powerlifting.gg',
					'localtest.me',
					'*.jaw.lol',
					'https://jaw.dev',
				],
			},
		},
	});
}

export function sessionHandler() {
	return session({
		secret: sessionConfig.secret,
		resave: true,
		saveUninitialized: true,
		store: sessionRedisStore,
		proxy: appConfig.env === 'production',
		cookie: {
			domain:
				appConfig.env === 'production'
					? `.${appConfig.production_app_url}`
					: `.${appConfig.development_app_url}`,
			maxAge: 1000 * 60 * 60 * 24, // 24 hours
			httpOnly: appConfig.env === 'production',
			sameSite: appConfig.env === 'production' ? 'none' : 'lax',
			secure: appConfig.env === 'production',
		},
	});
}
