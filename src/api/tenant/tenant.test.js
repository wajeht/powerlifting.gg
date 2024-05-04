import request from 'supertest';
import { db } from '../../database/db.js';
import { it, expect, describe } from 'vitest';
import { app as server } from '../../app.js';
import { refreshDatabase } from '../../tests/refresh-db.js';
import { app as appConfig } from '../../config/app.js';

const app = request(server);

await refreshDatabase();

describe('getAllTenantHandler', () => {
	it('should be able to get /api/tenants/:id end point with subdomain', async () => {
		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get(`/api/tenants/${tenant.id}`)
			.set('Host', `${tenant.slug}.${appConfig.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should be able to get /api/tenants/:id end point', async () => {
		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');

		const res = await app.get(`/api/tenants/${tenant.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.data[0]).toStrictEqual(tenant.data);
	});
});

describe('getTenantHandler', () => {
	it('should be able to get /api/tenants end point', async () => {
		const tenants = await db('tenants')
			.insert([
				{
					name: 'thanks',
					slug: 'obama',
					approved: true,
				},
				{
					name: 'deez',
					slug: 'nuts',
					approved: true,
				},
			])
			.returning('*');

		const res = await app.get('/api/tenants/');

		expect(res.statusCode).toBe(200);
		expect(res.body.data.length).toBe(2);
		expect(res.body.data[0].slug).toBe(tenants[1].slug);
		expect(res.body.data[1].slug).toBe(tenants[0].slug);
	});
});
