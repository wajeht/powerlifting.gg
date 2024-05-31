import fs from 'node:fs/promises';
import path from 'node:path';
import dayjs from 'dayjs';

import { session as sessionConfig } from '../../config/session.js';
import { db, redis } from '../../database/db.js';
import { getLog, getLogs } from './admin.util.js';
import { NotFoundError } from '../../app.error.js';

const logsDirPath = path.resolve(path.join(process.cwd(), 'src', 'logs'));

export function getAdminHandler() {
	return async (req, res) => {
		const startOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
		const endOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');

		const startOfPreviousMonth = dayjs()
			.subtract(1, 'month')
			.startOf('month')
			.format('YYYY-MM-DD HH:mm:ss');

		const { count: currentUserCount } = await db('users')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.count('* as count')
			.first();

		const { count: previousUserCount } = await db('users')
			.whereRaw('created_at >= ?', startOfPreviousMonth)
			.andWhereRaw('created_at < ?', startOfCurrentMonth)
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

		const formattedDndOfCurrentMonth = dayjs(startOfCurrentMonth).format('MMMM D');
		const formattedEndOfCurrentMonth = dayjs(endOfCurrentMonth).format('MMMM D');

		let logs;
		let date = req.query.date?.split('.log')[0];

		if (date) {
			date = dayjs(date).format('YYYY-MM-DD');
			logs = await getLog({ date, dirPath: logsDirPath });
		} else {
			date = dayjs().format('YYYY-MM-DD');
			logs = await getLog({ date, dirPath: logsDirPath });
		}

		logs = logs.sort((a, b) => b.time.localeCompare(a.time));

		const dates = (await getLogs(logsDirPath))
			.map((l) => l.date)
			.filter((d) => d !== `${date}.log`);

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
			date: date + '.log',
			logs,
			dates,
			flashMessages: req.flash(),
			title: 'Admin',
			path: '/admin',
			layout: '../layouts/admin.html',
		});
	};
}

export function postApproveTenantHandler() {
	return async (req, res) => {
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
	};
}

export function getReviewsHandler() {
	return async (req, res) => {
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
	};
}

export function getTenantsHandler() {
	return async (req, res) => {
		const tenants = await db.select('*').from('tenants').orderBy('created_at', 'desc');

		return res.status(200).render('./admin/tenants.html', {
			tenants,
			flashMessages: req.flash(),
			title: 'Admin / Tenants',
			path: '/admin/tenants',
			layout: '../layouts/admin.html',
		});
	};
}

export function getDatabaseHandler() {
	return async (req, res) => {
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
	};
}

export function getCacheHandler() {
	return async (req, res) => {
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
	};
}

export function deleteCacheHandler() {
	return async (req, res) => {
		if (req.body.method === 'delete') {
			const key = req.body.key;

			const found = await redis.get(key);

			if (!found) throw new NotFoundError();

			await redis.del(key);

			req.flash('success', `Cache ${key} has been deleted!`);

			return res.redirect('/admin/cache');
		}

		throw new NotFoundError();
	};
}
