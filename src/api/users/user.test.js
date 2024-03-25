import { db } from '../../database/db.js';
import request from 'supertest';
import { it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';

import { app as server } from '../../app.js';
import { env } from '../../conifg/env.js';

const app = request(server);

beforeAll(async () => {
	await db.migrate.latest();
});

afterEach(async () => {
	await db('users').del();
	await db('tenants').del();
});

afterAll(async () => {
	await db.migrate.rollback();
	await db.destroy();
});

it('should be able to get subdomain /api/users end point', async () => {
	const tenant = await db('tenants')
		.insert({
			name: faker.company.name(),
			slug: faker.lorem.slug(),
			emoji: faker.internet.emoji(),
			color: faker.color.rgb(),
		})
		.returning('*');

	console.log();

	let user = {
		username: faker.internet.userName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		role: 'USER',
		emoji: faker.internet.emoji(),
		tenant_id: tenant[0].id,
	};

	user = await db('users').insert(user).returning('*');

	const res = await app
		.get('/api/users')
		.set('Host', `${tenant[0].slug}.${env.development_app_url}`);

	expect(res.statusCode).toBe(200);
	expect(res.body.data[0]).toStrictEqual(user[0]);
});
