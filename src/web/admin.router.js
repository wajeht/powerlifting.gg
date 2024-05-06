import express from 'express';
import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../app.middleware.js';
const admin = express.Router();

admin.get(
	'/admin',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		return res.status(200).render('./admin/admin.html', {
			flashMessages: req.flash(),
			title: 'Admin',
			path: '/admin',
			layout: '../layouts/admin.html',
		});
	}),
);

admin.get(
	'/admin/reviews',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		return res.status(200).render('./admin/reviews.html', {
			flashMessages: req.flash(),
			title: 'Admin / Reviews',
			path: '/admin/reviews',
			layout: '../layouts/admin.html',
		});
	}),
);

admin.get(
	'/admin/tenants',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		return res.status(200).render('./admin/tenants.html', {
			flashMessages: req.flash(),
			title: 'Admin / Tenants',
			path: '/admin/tenants',
			layout: '../layouts/admin.html',
		});
	}),
);

export { admin };
