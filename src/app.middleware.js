import { csrfSync } from 'csrf-sync';
import { validationResult } from 'express-validator';
import { db } from './database/db.js';
import { app as appConfig } from './config/app.js';
import { backBlaze as backBlazeConfig, publicS3BucketConfig } from './config/back-blaze.js';
import multerS3 from 'multer-s3';
import multer from 'multer';
import {
	HttpError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
	UnimplementedFunctionError,
} from './app.error.js';

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

export function authenticationHandler(req, res, next) {
	try {
		if (!req.session.user) {
			if (req.tenant) {
				const tenantUrl = res.locals.app.configureDomain(res.locals.app.tenant.slug);
				req.session.redirectUrl = `${tenantUrl}${req.originalUrl}`;
			} else {
				req.session.redirectUrl = req.originalUrl;
			}

			return res.redirect('/login');
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

export function rateLimitHandler(req, res) {
	if (req.get('Content-Type') === 'application/json') {
		return res.json({ message: 'Too many requests, please try again later.' });
	}
	return res.status(429).render('./rate-limit.html');
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

export function localVariables(req, res, next) {
	res.locals.app = {
		env: appConfig.env,
		copyRightYear: new Date().getFullYear(),
		// prettier-ignore
		mainDomain: appConfig.env === 'production' ? `https://${appConfig.production_app_url}` : `http://${appConfig.development_app_url}`,
		configureDomain: (subdomain) => {
			if (appConfig.env === 'production') {
				return `https://${subdomain}.${appConfig.production_app_url}`;
			}
			return `http://${subdomain}.${appConfig.development_app_url}`;
		},
	};

	if (req.session.user) {
		res.locals.app['user'] = req.session.user;
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
			title: 'Error',
			path: `/${req.originalUrl}`,
			tenant: req.tenant,
			layout: '../layouts/tenant.html',
			error: errorMessage,
			statusCode,
		});
	}

	return res
		.status(statusCode)
		.render('error.html', { error: errorMessage, statusCode, title: 'Error', path: `/${req.originalUrl}` });
}

export async function skipOnMyIp(req, _res) {
	const myIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(', ')[0];
	return myIp == appConfig.myIp || process.env.NODE_ENV === 'development';
}
