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
	postSettingsTenantsDetailsValidation,
	postSettingsTenantsDangerZoneHandlerValidation,
	postSettingsAccountHandlerValidation,
	postNewsletterHandlerValidation,
	postSubscriptionsHandlerValidation,
	postExportTenantReviewsHandlerValidation,
} from './web.validation.js';
import {
	postCalibrateTenantRatings,
	postSubscribeToATenant,
	postSubscriptionsHandler,
	postSettingsDangerZoneHandler,
	postSettingsTenantsDangerZoneHandler,
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
	postSettingsTenantsImagesHandler,
	postNewsletterHandler,
	postExportTenantReviewsHandler,
	postSettingsTenantsDetails,
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
	getPrivacyPolicyHandler(WebService(WebRepository(db), redis, job)),
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
	getTermsOfServiceHandler(WebService(WebRepository(db), redis, job)),
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
	getSettingsHandler(WebService(WebRepository(db), redis, job)),
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
	postSettingsAccountHandler(WebService(WebRepository(db), redis, job)),
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
	getUnsubscribeHandler(WebService(WebRepository(db), redis, job), NotFoundError),
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
	postSettingsDangerZoneHandler(WebService(WebRepository(db), redis, job)),
);

/**
 * POST /settings/tenants/{id}/danger-zone
 * @tags web
 * @summary post settings tenants danger zone
 */
web.post(
	'/settings/tenants/:id/danger-zone',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	validateRequestHandler(postSettingsTenantsDangerZoneHandlerValidation),
	postSettingsTenantsDangerZoneHandler(WebService(WebRepository(db), redis, job)),
);

/**
 * POST /settings/tenants/{id}/images
 * @tags web
 * @summary post settings tenants images
 */
web.post(
	'/settings/tenants/:id/images',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	uploadHandler.fields([
		{ name: 'logo', maxCount: 1 },
		{ name: 'banner', maxCount: 1 },
	]),
	csrfHandler,
	postSettingsTenantsImagesHandler(WebService(WebRepository(db), redis, job)),
);

/**
 * POST /settings/tenants/{id}/details
 * @tags web
 * @summary post settings tenants details
 */
web.post(
	'/settings/tenants/:id/details',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	validateRequestHandler(postSettingsTenantsDetailsValidation),
	postSettingsTenantsDetails(WebService(WebRepository(db), redis, job)),
);

/**
 * GET /settings/tenants
 * @tags web
 * @summary get settings tenants page
 */
web.get(
	'/settings/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	getSettingsTenantsHandler(WebService(WebRepository(db), redis, job)),
);

/**
 * GET /settings/tenants/{id}
 * @tags web
 * @summary get settings tenant details page
 */
web.get(
	'/settings/tenants/:id',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	getSettingsTenantHandler(WebService(WebRepository(db), redis, job)),
);

/**
 * GET /login
 * @tags auth
 * @summary get login url
 */
web.get('/login', tenantIdentityHandler, getLoginHandler());

/**
 * GET /logout
 * @tags auth
 * @summary get logout url
 */
web.get('/logout', tenantIdentityHandler, getLogoutHandler());

/**
 * GET /contact
 * @tags contact
 * @summary get contact page
 */
web.get('/contact', tenantIdentityHandler, throwTenancyHandler, csrfHandler, getContactHandler());

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
	postContactHandler(WebService(WebRepository(db), redis, job)),
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
	getTenantsHandler(TenantService(db, redis, dayjs, badWord)),
);

/**
 * GET /tenants/settings/create
 * @tags tenants
 * @summary get tenant create page
 */
web.get(
	'/tenants/settings/create',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	csrfHandler,
	getTenantsCreateHandler(),
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
	postSubscribeToATenant(
		TenantService(db, redis, dayjs, badWord),
		WebService(WebRepository(db), redis, job),
	),
);

/**
 * POST /tenants/export-reviews
 * @tags tenants
 * @summary export tenant reviews
 */
web.post(
	'/tenants/export-reviews',
	csrfHandler,
	validateRequestHandler(postExportTenantReviewsHandlerValidation),
	postExportTenantReviewsHandler(WebService(WebRepository(db), redis, job)),
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
	postCalibrateTenantRatings(WebService(WebRepository(db), redis, job)),
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
	postTenantHandler(WebService(WebRepository(db), redis, job)),
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
	getIndexHandler(WebRepository(db), TenantService(db, redis, dayjs, badWord)),
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
	getReviewsHandler(),
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
	postReviewHandler(
		TenantService(db, redis, dayjs, badWord),
		WebService(WebRepository(db), redis, job),
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
	postNewsletterHandler(WebService(WebRepository(db), redis, job)),
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
	postSubscriptionsHandler(WebService(WebRepository(db), redis, job)),
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
	getBlogHandler(WebService(WebRepository(db), redis, job)),
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
	getBlogPostHandler(WebService(WebRepository(db), redis, job)),
);

export { web };
