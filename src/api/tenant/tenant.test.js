import { db } from '../../database/db.js';
import request from 'supertest';
import { it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

import { app as server } from '../../app.js';
import { env } from '../../conifg/env.js';
import { refreshDatabase } from '../../utils/refresh-db.js';

const app = request(server);

await refreshDatabase();

it('should be able to get subdomain /api/tenant/:id end point', async () => {
	const tenant = await db('tenants')
		.insert({
			name: faker.company.name(),
			slug: faker.lorem.slug(),
			emoji: faker.internet.emoji(),
			color: faker.color.rgb(),
		})
		.returning('*');

	const res = await app
		.get(`/api/tenants/${tenant[0].id}`)
		.set('Host', `${tenant[0].slug}.${env.development_app_url}`);

	expect(res.statusCode).toBe(200);
	expect(res.body.data[0]).toStrictEqual(tenant[0]);
});