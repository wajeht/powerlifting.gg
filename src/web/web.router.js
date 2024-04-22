import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import express from 'express';
import { db, redis } from '../database/db.js';
import { sendContactEmailJob } from '../job/job.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	authenticationHandler,
	tenancyHandler,
	csrfHandler,
	// validateRequestHandler,
} from '../app.middleware.js';
import { oauth as oauthRouter } from '../oauth/oauth.router.js';
import {
	getContactHandler,
	postContactHandler,
	getHealthzHandler,
	getIndexHandler,
	getTenantsHandler,
	getPrivacyPolicyHandler,
	getTenantsCreateHandler,
	getTermsOfServiceHandler,
	getModerationPolicyHandler,
	getReviewsHandler,
	getLoginHandler,
	getLogoutHandler,
	postTenantHandler,
	postReviewHandler,
	getSettingsHandler,
	getBlogHandler,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { WebService } from './web.service.js';
import { TenantService } from '../api/tenant/tenant.service.js';
// import { body } from 'express-validator';

dayjs.extend(relativeTime);

const web = express.Router();

web.use(oauthRouter);

/**
 * GET /healthz
 * @tags web
 * @summary get healthz page
 */
web.get('/healthz', getHealthzHandler());

/**
 * GET /moderation-policy
 * @tags web
 * @summary get moderation policy
 */
web.get(
	'/moderation-policy',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getModerationPolicyHandler(WebService(WebRepository, redis))),
);

/**
 * GET /privacy-policy
 * @tags web
 * @summary get privacy policy page
 */
web.get(
	'/privacy-policy',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getPrivacyPolicyHandler(WebService(WebRepository, redis))),
);

/**
 * GET /terms-of-services
 * @tags web
 * @summary get terms of services page
 */
web.get(
	'/terms-of-services',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTermsOfServiceHandler(WebService(WebRepository, redis))),
);

/**
 * GET /settings
 * @tags web
 * @summary get settings page
 */
web.get(
	'/settings',
	tenantIdentityHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getSettingsHandler()),
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
	csrfHandler,
	catchAsyncErrorHandler(postContactHandler(sendContactEmailJob)),
);

/**
 * GET /tenants
 * @tags tenants
 * @summary get tenants page
 */
web.get('/tenants', catchAsyncErrorHandler(getTenantsHandler(TenantService(db, redis))));

/**
 * GET /tenants/create
 * @tags tenants
 * @summary get tenant create page
 */
web.get(
	'/tenants/create',
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getTenantsCreateHandler()),
);

/**
 * POST /tenants/create
 * @tags tenants
 * @summary post tenant
 */
web.post(
	'/tenants',
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(postTenantHandler()),
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
	catchAsyncErrorHandler(getIndexHandler(WebRepository(db), TenantService(db, redis, dayjs))),
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
	catchAsyncErrorHandler(postReviewHandler(TenantService(db, redis))),
);

/**
 * GET /blog
 * @tags web
 * @summary get blog page
 */
web.get(
	'/blog',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getBlogHandler(WebService(WebRepository, redis))),
);

export { web };
