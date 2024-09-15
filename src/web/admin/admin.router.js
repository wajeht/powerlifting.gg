import express from 'express';
import {
	authenticationHandler,
	authorizePermissionHandler,
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
	getUsersHandler,
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
	getAdminHandler(),
);

admin.post(
	'/admin/tenants/approve',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	postApproveTenantHandler(),
);

admin.get(
	'/admin/reviews',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	getReviewsHandler(),
);

admin.get(
	'/admin/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	getTenantsHandler(),
);

admin.get(
	'/admin/database',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	getDatabaseHandler(),
);

admin.get(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	getCacheHandler(),
);

admin.get(
	'/admin/users',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	getUsersHandler(),
);

admin.post(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	deleteCacheHandler(),
);

export { admin };
