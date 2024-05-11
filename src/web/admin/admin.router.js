import dayjs from 'dayjs';
import express from 'express';
import { db, redis } from '../../database/db.js';
import { session as sessionConfig } from '../../config/session.js';
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
		const startOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
		const endOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');

		const currentMonthStart = dayjs().startOf('month');
		const previousMonthStart = dayjs().subtract(1, 'month').startOf('month');

		const currentMonthStartFormatted = currentMonthStart.format('YYYY-MM-DD HH:mm:ss');
		const previousMonthStartFormatted = previousMonthStart.format('YYYY-MM-DD HH:mm:ss');

		const { count: currentUserCount } = await db('users')
			.whereRaw('created_at >= ?', currentMonthStartFormatted)
			.count('* as count')
			.first();

		const { count: previousUserCount } = await db('users')
			.whereRaw('created_at >= ?', previousMonthStartFormatted)
			.andWhereRaw('created_at < ?', currentMonthStartFormatted)
			.count('* as count')
			.first();

		let percentChange;
		if (previousUserCount === 0) {
			percentChange = currentUserCount === 0 ? 0 : 100;
		} else {
			percentChange = ((currentUserCount - previousUserCount) / previousUserCount) * 100;
		}

		let changeDescription;
		if (percentChange > 0) {
			changeDescription = `↗︎ ${currentUserCount} (${percentChange.toFixed(2)}%)`;
		} else if (percentChange < 0) {
			changeDescription = `↘︎ ${currentUserCount} (${Math.abs(percentChange).toFixed(2)}%)`;
		} else {
			changeDescription = `${currentUserCount} (No change)`;
		}

		const { count: currentTenantCount } = await db('tenants')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.andWhereRaw('created_at <= ?', endOfCurrentMonth)
			.count('* as count')
			.first();

		const { count: currentReviewCount } = await db('reviews')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.andWhereRaw('created_at <= ?', endOfCurrentMonth)
			.count('* as count')
			.first();

		const formattedDndOfCurrentMonth = dayjs(startOfCurrentMonth).format('MMMM d');
		const formattedEndOfCurrentMonth = dayjs(endOfCurrentMonth).format('MMMM d');

		return res.status(200).render('./admin/admin.html', {
			user: {
				count: currentUserCount,
				percentChange: changeDescription,
			},
			tenant: {
				count: currentTenantCount,
				startOfCurrentMonth: formattedDndOfCurrentMonth,
				endOfCurrentMonth: formattedEndOfCurrentMonth,
			},
			review: {
				count: currentReviewCount,
				startOfCurrentMonth: formattedDndOfCurrentMonth,
				endOfCurrentMonth: formattedEndOfCurrentMonth,
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
		const tenants = await db.select('*').from('tenants').orderBy('created_at', 'desc');

		return res.status(200).render('./admin/tenants.html', {
			tenants,
			flashMessages: req.flash(),
			title: 'Admin / Tenants',
			path: '/admin/tenants',
			layout: '../layouts/admin.html',
		});
	}),
);

admin.get(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		const cache = [];
		const keys = await redis.keys('*');

		for (const key of keys) {
			const type = await redis.type(key);
			let value;

			switch (type) {
				case 'string':
					value = await redis.get(key);
					break;
				case 'hash':
					value = await redis.hgetall(key);
					break;
				case 'list':
					value = await redis.lrange(key, 0, -1);
					break;
				case 'set':
					value = await redis.smembers(key);
					break;
				case 'zset':
					value = await redis.zrange(key, 0, -1, 'WITHSCORES');
					break;
				default:
					value = 'Unknown type';
					break;
			}

			if (!key.startsWith('bull:') && !key.startsWith(sessionConfig.store_prefix)) {
				const ttl = await redis.ttl(key);
				cache.push({ key, ttl, value });
			}
		}

		return res.status(200).render('./admin/cache.html', {
			cache,
			flashMessages: req.flash(),
			title: 'Admin / Cache',
			path: '/admin/cache',
			layout: '../layouts/admin.html',
		});
	}),
);

export { admin };
