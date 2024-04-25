import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from '../app.js';
import { db } from '../database/db.js';
import { faker } from '@faker-js/faker';
import { refreshDatabase } from '../utils/refresh-db.js';
import { app as appEnv } from '../config/app.js';

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

describe('when visiting / route, if there is no tenant', () => {
	it('should go to the main domain page', async () => {
		const tenants = Array.from({ length: 5 }, () => ({
			name: faker.company.name(),
			slug: faker.lorem.slug(),
		}));

		await db('tenants').insert(tenants);

		const res = await app.get('/');
		expect(res.status).toBe(200);
		expect(res.text).include("Let's Find Your");
	});
});

describe('index', () => {
	it('should be able to visit a tenant page', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
			})
			.returning('*');

		const res = await app.get('/').set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);

		expect(res.statusCode).toBe(200);
		expect(res.text).contain('obama');
	});
});
