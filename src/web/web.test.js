import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from '../app.js';
import { db } from '../database/db.js';
import { faker } from '@faker-js/faker';
import { refreshDatabase } from '../utils/refresh-db.js';

const app = request(server);

await refreshDatabase();

it('should be able to get /healthz end point with json', async () => {
	const res = await app.get('/healthz').set('Content-Type', 'application/json');
	expect(res.status).toBe(200);
	expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
	expect(res.body).toHaveProperty('message');
	expect(res.body).toHaveProperty('uptime');
});

it('should be able to get /healthz end point with html', async () => {
	const res = await app.get('/healthz');
	expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
	expect(res.status).toBe(200);
	expect(res.text).include('ok');
});

describe('when visiting / route', () => {
	describe('if there is no tenant', () => {
		it.skip('should go to the main domain with all the tenants listed in the page', async () => {
			const tenants = Array.from({ length: 5 }, () => ({
				name: faker.company.name(),
				slug: faker.lorem.slug(),
			}));

			await db('tenants').insert(tenants);

			const res = await app.get('/');
			expect(res.status).toBe(200);
			for (const tenant of tenants) {
				expect(res.text).toContain(tenant.name);
			}
		});
	});
});
