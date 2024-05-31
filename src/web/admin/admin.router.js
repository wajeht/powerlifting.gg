import express from 'express';
import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
	csrfHandler,
} from '../../app.middleware.js';

import {
	deleteCacheHandler,
	getAdminHandler,
	getCacheHandler,
	getDatabaseHandler,
	getReviewsHandler,
	getTenantsHandler,
	postApproveTenantHandler,
} from './admin.handler.js';

const admin = express.Router();

admin.get(
	'/admin',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(getAdminHandler()),
);

admin.post(
	'/admin/tenants/approve',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(postApproveTenantHandler()),
);

admin.get(
	'/admin/reviews',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(getReviewsHandler()),
);

admin.get(
	'/admin/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(getTenantsHandler()),
);

admin.get(
	'/admin/database',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(getDatabaseHandler()),
);

admin.get(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(getCacheHandler()),
);

admin.post(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(deleteCacheHandler()),
);

export { admin };
