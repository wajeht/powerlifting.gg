import express from 'express';
import { db, redis } from '../database/db.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	tenancyHandler,
	// validateRequestHandler,
} from '../app.middlewares.js';
import { NotFoundError, UnimplementedFunctionError } from '../app.errors.js';
import { oauth as oauthRouter } from '../oauth/oauth.router.js';
import {
	getContactHandler,
	getHealthzHandler,
	getIndexHandler,
	getTenantsHandler,
	getPrivacyPolicyHandler,
	getTenantsNewHandler,
	getTermsOfServiceHandler,
	getUser,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { WebService } from './web.service.js';
import { TenantService } from '../api/tenant/tenant.service.js';
import { SearchService } from '../api/search/search.service.js';
// import { body } from 'express-validator';

const web = express.Router();

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

web.post(
	'/user/:id',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(
		getUser(WebService(WebRepository(db), NotFoundError, UnimplementedFunctionError)),
	),
);

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

web.get(
	'/user/:username',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(async (req, res) => {
		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, username: req.params.username })
			.first();

		if (!user) throw new NotFoundError();

		return res.status(200).render('user.html', {
			user,
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

export { web };
