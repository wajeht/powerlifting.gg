import path from 'path';
import fs from 'fs/promises';
import express from 'express';
import { db, redis } from '../../database/db.js';
import { session as sessionConfig } from '../../config/session.js';
import { NotFoundError } from '../../app.error.js';
import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
	csrfHandler,
} from '../../app.middleware.js';

import { getAdminHandler } from './admin.handler.js';

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
	catchAsyncErrorHandler(async (req, res) => {
		const ids = req.body.id.map((id) => parseInt(id));

		const tenants = await db
			.select('*')
			.from('tenants')
			.whereIn('id', ids)
			.andWhere({ approved: false });

		if (!tenants.length) throw new NotFoundError();

		await db('tenants').whereIn('id', ids).update({ approved: true });

		tenants.forEach((tenant) => req.flash('success', `${tenant.slug} has been approved!`));

		return res.redirect('/admin/tenants');
	}),
);

admin.get(
	'/admin/reviews',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(async (req, res) => {
		const reviews = await db('reviews')
			.select(
				'reviews.*',
				'users.username',
				'users.profile_picture',
				'tenants.slug',
				'tenants.name as tenant_name',
			)
			.join('users', 'reviews.user_id', 'users.id')
			.join('tenants', 'reviews.tenant_id', 'tenants.id')
			.orderBy('reviews.created_at', 'desc');

		return res.status(200).render('./admin/reviews.html', {
			reviews,
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
	csrfHandler,
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
	'/admin/database',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(async (req, res) => {
		const backupFiles = await fs.readdir(path.resolve(process.cwd(), 'src', 'database', 'backup'));

		let backup = [];
		for (const file of backupFiles) {
			if (file.endsWith('.sqlite.gz')) {
				let dateStr = file.replace('db-', '').replace('.sqlite.gz', '');
				backup.push({
					path: path.resolve(process.cwd(), 'src', 'database', 'backup', file),
					created_at: dateStr,
					name: file,
				});
			}
		}

		backup.sort((a, b) => b.created_at.localeCompare(a.created_at));

		return res.status(200).render('./admin/database.html', {
			backup,
			flashMessages: req.flash(),
			title: 'Admin / Database',
			path: '/admin/database',
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
	csrfHandler,
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

admin.post(
	'/admin/cache',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	csrfHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (req.body.method === 'delete') {
			const key = req.body.key;

			const found = await redis.get(key);

			if (!found) throw new NotFoundError();

			await redis.del(key);

			req.flash('success', `Cache ${key} has been deleted!`);

			return res.redirect('/admin/cache');
		}

		throw new NotFoundError();
	}),
);

export { admin };
