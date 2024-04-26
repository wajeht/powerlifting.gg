import { db } from '../../database/db.js';
import request from 'supertest';
import { it, expect, describe } from 'vitest';

import { app as server } from '../../app.js';
import { refreshDatabase } from '../../tests/refresh-db.js';

const app = request(server);

await refreshDatabase();

describe('getAllTenantHandler', () => {
	it('should be able to get /api/tenants/:id end point', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
			})
			.returning('*');

		const res = await app.get(`/api/tenants/${tenant[0].id}`);

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
				},
				{
					name: 'deez',
					slug: 'nuts',
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
