import request from 'supertest';
import { it, expect, describe, beforeAll, afterEach, afterAll } from 'vitest';
import { app as server } from '../app.js';
import { db } from '../database/db.js';
import { faker } from '@faker-js/faker';

const app = request(server);

it('should be able to get /healthz end point', async () => {
	const res = await app.get('/healthz');
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty('message');
	expect(res.body).toHaveProperty('date');
});

describe('when visiting / route', () => {
	beforeAll(async () => {
		await db.migrate.latest();
	});

	afterEach(async () => {
		await db('tenants').del();
	});

	afterAll(async () => {
		await db.migrate.rollback();
		await db.destroy();
	});

	describe('if there is no tenant', () => {
		it('should go to the main domain with all the tenants listed in the page', async () => {
			const tenants = Array.from({ length: 5 }, () => ({
				name: faker.company.name(),
				slug: faker.lorem.slug(),
				emoji: faker.internet.emoji(),
				color: faker.internet.color(),
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
