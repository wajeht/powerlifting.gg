import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import express from 'express';
import { db, redis } from '../database/db.js';
import { oauth as oauthRouter } from './oauth/oauth.router.js';
import { admin as adminRouter } from './admin.router.js';
import { test as testRouter } from './test/test.router.js';
import badWord from 'bad-words';
import { job } from '../job/job.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	authenticationHandler,
	tenancyHandler,
	csrfHandler,
	uploadHandler,
	validateRequestHandler,
	throwTenancyHandler,
} from '../app.middleware.js';
import {
	postContactHandlerValidation,
	postReviewHandlerValidation,
	postTenantHandlerValidation,
} from './web.validation.js';
import {
	getSettingsTenantHandler,
	getContactHandler,
	postContactHandler,
	getHealthzHandler,
	getIndexHandler,
	getTenantsHandler,
	getPrivacyPolicyHandler,
	getTenantsCreateHandler,
	getTermsOfServiceHandler,
	getReviewsHandler,
	getLoginHandler,
	getLogoutHandler,
	postTenantHandler,
	postReviewHandler,
	getSettingsHandler,
	getBlogHandler,
	getBlogPostHandler,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { WebService } from './web.service.js';
import { TenantService } from '../api/tenant/tenant.service.js';

dayjs.extend(relativeTime);

const web = express.Router();

web.use(adminRouter);

web.use(oauthRouter);

web.use(testRouter);

/**
 * GET /healthz
 * @tags web
 * @summary get healthz page
 */
web.get('/healthz', getHealthzHandler());

/**
 * GET /privacy-policy
 * @tags web
 * @summary get privacy policy page
 */
web.get(
	'/privacy-policy',
	tenantIdentityHandler,
	throwTenancyHandler,
	catchAsyncErrorHandler(getPrivacyPolicyHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /terms-of-services
 * @tags web
 * @summary get terms of services page
 */
web.get(
	'/terms-of-services',
	tenantIdentityHandler,
	throwTenancyHandler,
	catchAsyncErrorHandler(getTermsOfServiceHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /settings
 * @tags web
 * @summary get settings page
 */
web.get(
	'/settings',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getSettingsHandler()),
);

/**
 * GET /settings/tenant
 * @tags web
 * @summary get settings tenant page
 */
web.get(
	'/settings/tenant',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getSettingsTenantHandler()),
);

/**
 * GET /login
 * @tags auth
 * @summary get login url
 */
web.get('/login', tenantIdentityHandler, catchAsyncErrorHandler(getLoginHandler()));

/**
 * GET /logout
 * @tags auth
 * @summary get logout url
 */
web.get('/logout', tenantIdentityHandler, catchAsyncErrorHandler(getLogoutHandler()));

/**
 * GET /contact
 * @tags contact
 * @summary get contact page
 */
web.get(
	'/contact',
	tenantIdentityHandler,
	throwTenancyHandler,
	csrfHandler,
	catchAsyncErrorHandler(getContactHandler()),
);

/**
 * POST /contact
 * @tags contact
 * @summary post contact
 */
web.post(
	'/contact',
	tenantIdentityHandler,
	throwTenancyHandler,
	csrfHandler,
	validateRequestHandler(postContactHandlerValidation),
	catchAsyncErrorHandler(postContactHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /tenants
 * @tags tenants
 * @summary get tenants page
 */
web.get(
	'/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	catchAsyncErrorHandler(getTenantsHandler(TenantService(db, redis, dayjs, badWord))),
);

/**
 * GET /tenants/create
 * @tags tenants
 * @summary get tenant create page
 */
web.get(
	'/tenants/create',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getTenantsCreateHandler()),
);

/**
 * POST /tenants
 * @tags tenants
 * @summary post tenant
 */
web.post(
	'/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	uploadHandler.fields([
		{ name: 'logo', maxCount: 1 },
		{ name: 'banner', maxCount: 1 },
	]),
	csrfHandler,
	validateRequestHandler(postTenantHandlerValidation),
	catchAsyncErrorHandler(postTenantHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET <subdomain>/
 * @tags <subdomain>/reviews
 * @summary get tenant reviews page
 */

/**
 * GET /
 * @tags web
 * @summary get index page
 */
web.get(
	'/',
	tenantIdentityHandler,
	csrfHandler,
	catchAsyncErrorHandler(
		getIndexHandler(WebRepository(db), TenantService(db, redis, dayjs, badWord)),
	),
);

/**
 * GET /{subdomain}/reviews
 * @tags {subdomain}/reviews
 * @summary get /{subdomain}/reviews
 * @param {string} subdomain.path.required - the subdomain - application/x-www-form-urlencoded
 */
web.get(
	'/reviews',
	tenantIdentityHandler,
	tenancyHandler,
	authenticationHandler,
	catchAsyncErrorHandler(getReviewsHandler()),
);

/**
 * POST /{subdomain}/reviews
 * @tags {subdomain}/reviews
 * @summary post /{subdomain}/reviews
 * @param {string} subdomain.path.required - the subdomain - application/x-www-form-urlencoded
 */
web.post(
	'/reviews',
	tenantIdentityHandler,
	tenancyHandler,
	authenticationHandler,
	csrfHandler,
	validateRequestHandler(postReviewHandlerValidation),
	catchAsyncErrorHandler(postReviewHandler(TenantService(db, redis, dayjs, badWord))),
);

/**
 * GET /blog
 * @tags web
 * @summary get blog page
 */
web.get(
	'/blog',
	tenantIdentityHandler,
	throwTenancyHandler,
	catchAsyncErrorHandler(getBlogHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /blog/{id}
 * @tags web
 * @summary get blog post
 */
web.get(
	'/blog/:id',
	tenantIdentityHandler,
	throwTenancyHandler,
	catchAsyncErrorHandler(getBlogPostHandler(WebService(WebRepository(db), redis, job))),
);

export { web };
