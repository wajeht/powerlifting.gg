import dayjs from 'dayjs';
import { db } from '../../database/db.js';
import express from 'express';
import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../../app.middleware.js';
const admin = express.Router();

admin.get(
	'/admin',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
		const today = dayjs().format('YYYY-MM-DD HH:mm:ss');
		const { count: userCount } = await db('users')
			.whereRaw('created_at >= ?', startOfMonth)
			.andWhereRaw('created_at <= ?', today)
			.count('* as count')
			.first();
		const { count: tenantCount } = await db('tenants')
			.whereRaw('created_at >= ?', startOfMonth)
			.andWhereRaw('created_at <= ?', today)
			.count('* as count')
			.first();
		const { count: reviewCount } = await db('reviews')
			.whereRaw('created_at >= ?', startOfMonth)
			.andWhereRaw('created_at <= ?', today)
			.count('* as count')
			.first();
		const formattedStartOfMonth = dayjs(startOfMonth).format('MMMM D');
		const formattedToday = dayjs(today).format('MMMM D');
		return res.status(200).render('./admin/admin.html', {
			user: {
				count: userCount,
				startOfMonth: formattedStartOfMonth,
				today: formattedToday,
			},
			tenant: {
				count: tenantCount,
				startOfMonth: formattedStartOfMonth,
				today: formattedToday,
			},
			review: {
				count: reviewCount,
				startOfMonth: formattedStartOfMonth,
				today: formattedToday,
			},
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
