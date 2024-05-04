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

	describe('when visiting /api/tenants/:id end pint', () => {
		it('should only be to able to get approved tenant', async () => {
			const tenant = await db('tenants')
				.insert([
					{
						name: 'thanks',
						slug: 'obama',
						approved: true,
					},
					{
						name: 'say',
						slug: 'say',
						approved: false,
					}
				])
				.returning('*');

			const res = await app.get(`/api/tenants/${tenant[0].id}`);
			expect(res.statusCode).toBe(200);
			expect(res.body.data[0]).toStrictEqual(tenant[0].data);

			const resTwo = await app.get(`/api/tenants/${tenant[1].id}`);
			expect(resTwo.statusCode).toBe(404);
		});
	})
});

describe('getTenantHandler', () => {
	it('should be able to get /api/tenants end point with approved tenants', async () => {
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
				{
					name: '69',
					slug: '420',
					approved: false,
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
