import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from '../../app.js';
import { db } from '../../database/db.js';
import { refreshDatabase } from '../../tests/refresh-db.js';
import { app as appConfig } from '../../config/app.js';
import { login } from '../../tests/login.js';

const app = request(server);

await refreshDatabase();

describe('admin', () => {
	it('should not be able to reach api/admin/cache/clear route with <subdomain>/api/admin/cache/clear', async () => {
		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
			})
			.returning('*');
		const res = await app
			.post('/api/admin/cache/clear')
			.set('Host', `${tenant.slug}.${appConfig.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should not be able to reach api/admin/cache/clear without auth', async () => {
		const res = await app.post('/api/admin/cache/clear');
		expect(res.statusCode).toBe(302);
	});

	it('should not be able to reach /api/admin/cache/clear without SUPER_ADMIN user', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'ADMIN',
			})
			.returning('*');

		await db('tenants')
			.insert({
				name: 'TenantName',
				slug: 'tenant-slug',
			})
			.returning('*');

		const { cookie } = await login(
			app,
			appConfig.development_app_url,
			'user1@test.com',
			'tenant-slug',
		);
		const res = await app.post('/api/admin/cache/clear').set('Cookie', cookie);
		expect(res.statusCode).toBe(401);
	});

	it('should be able to reach /api/admin/cache/clear with SUPER_ADMIN user', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'SUPER_ADMIN',
			})
			.returning('*');

		await db('tenants')
			.insert({
				name: 'TenantName',
				slug: 'tenant-slug',
			})
			.returning('*');

		const { cookie } = await login(
			app,
			appConfig.development_app_url,
			'user1@test.com',
			'tenant-slug',
		);
		const res = await app.post('/api/admin/cache/clear').set('Cookie', cookie);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('ok');
	});
});
