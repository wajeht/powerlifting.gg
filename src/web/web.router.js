import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import express from 'express';
import { db, redis } from '../database/db.js';
import { oauth as oauthRouter } from './oauth/oauth.router.js';
import { admin as adminRouter } from './admin/admin.router.js';
import { test as testRouter } from './test/test.router.js';
import { NotFoundError } from '../app.error.js';
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
	getUnsubscribeHandlerValidation,
	getBlogPostHandlerValidation,
	postCalibrateTenantRatingsValidation,
	postSubscribeToATenantValidation,
	postContactHandlerValidation,
	postReviewHandlerValidation,
	postTenantHandlerValidation,
	postSettingsAccountHandlerValidation,
	postNewsletterHandlerValidation,
	postSubscriptionsHandlerValidation,
} from './web.validation.js';
import {
	postCalibrateTenantRatings,
	postSubscribeToATenant,
	postSubscriptionsHandler,
	postSettingsDangerZoneHandler,
	getSettingsTenantsHandler,
	getSettingsTenantHandler,
	getContactHandler,
	postContactHandler,
	getUnsubscribeHandler,
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
	postSettingsAccountHandler,
	postNewsletterHandler,
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
	catchAsyncErrorHandler(getSettingsHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * POST /settings/account
 * @tags web
 * @summary post settings account
 */
web.post(
	'/settings/account',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	validateRequestHandler(postSettingsAccountHandlerValidation),
	catchAsyncErrorHandler(postSettingsAccountHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /unsubscribe
 * @tags web
 * @summary get unsubscribe endpoint
 */
web.get(
	'/unsubscribe',
	tenantIdentityHandler,
	throwTenancyHandler,
	csrfHandler,
	validateRequestHandler(getUnsubscribeHandlerValidation),
	catchAsyncErrorHandler(
		getUnsubscribeHandler(WebService(WebRepository(db), redis, job), NotFoundError),
	),
);

/**
 * POST /settings/danger-zone
 * @tags web
 * @summary post settings danger zone
 */
web.post(
	'/settings/danger-zone',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(postSettingsDangerZoneHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /settings/tenants
 * @tags web
 * @summary get settings tenant page
 */
web.get(
	'/settings/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getSettingsTenantsHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * GET /settings/tenants/{id}
 * @tags web
 * @summary get settings tenant page
 */
web.get(
	'/settings/tenants/:id',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(getSettingsTenantHandler(WebService(WebRepository(db), redis, job))),
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
 * POST /tenants/{id}/subscribe
 * @tags tenants
 * @summary subscribe to a  tenant
 */
web.post(
	'/tenants/:id/subscribe',
	csrfHandler,
	validateRequestHandler(postSubscribeToATenantValidation),
	catchAsyncErrorHandler(
		postSubscribeToATenant(
			TenantService(db, redis, dayjs, badWord),
			WebService(WebRepository(db), redis, job),
		),
	),
);

/**
 * POST /tenants/calibrate-ratings
 * @tags tenants
 * @summary calibrate a tenant reviews
 */
web.post(
	'/tenants/calibrate-ratings',
	csrfHandler,
	validateRequestHandler(postCalibrateTenantRatingsValidation),
	catchAsyncErrorHandler(postCalibrateTenantRatings(WebService(WebRepository(db), redis, job))),
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
	catchAsyncErrorHandler(
		postReviewHandler(
			TenantService(db, redis, dayjs, badWord),
			WebService(WebRepository(db), redis, job),
		),
	),
);

/**
 * POST /newsletter
 * @tags web
 * @summary post /newsletter
 */
web.post(
	'/newsletter',
	csrfHandler,
	validateRequestHandler(postNewsletterHandlerValidation),
	catchAsyncErrorHandler(postNewsletterHandler(WebService(WebRepository(db), redis, job))),
);

/**
 * POST /subscriptions
 * @tags web
 * @summary post /subscriptions
 */
web.post(
	'/subscriptions',
	csrfHandler,
	validateRequestHandler(postSubscriptionsHandlerValidation),
	catchAsyncErrorHandler(postSubscriptionsHandler(WebService(WebRepository(db), redis, job))),
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
	csrfHandler,
	validateRequestHandler(getBlogPostHandlerValidation),
	catchAsyncErrorHandler(getBlogPostHandler(WebService(WebRepository(db), redis, job))),
);

export { web };
