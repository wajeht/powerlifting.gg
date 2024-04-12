import express from 'express';
import { db, redis } from '../database/db.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	// validateRequestHandler,
} from '../app.middlewares.js';
import { oauth as oauthRouter } from '../oauth/oauth.router.js';
import {
	getContactHandler,
	postContactHandler,
	getHealthzHandler,
	getIndexHandler,
	getTenantsHandler,
	getPrivacyPolicyHandler,
	getTenantsNewHandler,
	getTermsOfServiceHandler,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { TenantService } from '../api/tenant/tenant.service.js';
import { SearchService } from '../api/search/search.service.js';
// import { body } from 'express-validator';

const web = express.Router();

/**
 * @tags oauth
 */
web.use(oauthRouter);

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
	catchAsyncErrorHandler(getPrivacyPolicyHandler()),
);

/**
 * GET /terms-of-services
 * @tags web
 * @summary get terms of services page
 */
web.get(
	'/terms-of-services',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTermsOfServiceHandler()),
);

/**
 * GET /contact
 * @tags web
 * @summary get contact page
 */
web.get('/contact', tenantIdentityHandler, catchAsyncErrorHandler(getContactHandler()));

/**
 * POST /contact
 * @tags web
 * @summary post contact
 */
web.post('/contact', tenantIdentityHandler, catchAsyncErrorHandler(postContactHandler()));

/**
 * GET /tenants
 * @tags web
 * @summary get tenants page
 */
web.get('/tenants', catchAsyncErrorHandler(getTenantsHandler(SearchService(db, redis))));

/**
 * GET /tenants/new
 * @tags web
 * @summary get tenants new page
 */
web.get('/tenants/new', catchAsyncErrorHandler(getTenantsNewHandler()));

/**
 * GET /
 * @tags web
 * @summary get index page
 */
web.get(
	'/',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getIndexHandler(WebRepository(db), TenantService(db, redis))),
);

export { web };
