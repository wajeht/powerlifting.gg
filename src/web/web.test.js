import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from '../app.js';
import { db } from '../database/db.js';
import { faker } from '@faker-js/faker';
import { refreshDatabase } from '../tests/refresh-db.js';
import { app as appEnv } from '../config/app.js';
import { login } from '../tests/login.js';

const app = request(server);

await refreshDatabase();

describe('getHealthzHandler', () => {
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
});

describe('getIndexHandler', () => {
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

describe('getContactHandler', () => {
	it('should not be able to get contact page with tenant domain', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
			})
			.returning('*');
		const res = await app
			.get('/contact')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should be able to get contact page', async () => {
		const res = await app.get('/contact');
		expect(res.statusCode).toBe(200);
		expect(res.text).contain('Use the contact form to get in touch or email us');
	});
});

describe('postReviewHandler', () => {
	describe('when posting a tenant review with profanity', () => {
		it('should filter profanity into *****', async () => {
			const user = (
				await db('users')
					.insert({
						username: 'user1',
						email: 'user1@test.com',
						role: 'USER',
					})
					.returning('*')
			)[0];

			const tenant = (
				await db('tenants')
					.insert({
						name: 'TenantName',
						slug: 'tenant-slug',
					})
					.returning('*')
			)[0];

			const { cookie, csrfToken } = await login(
				app,
				appEnv.development_app_url,
				'user1@test.com',
				'tenant-slug',
			);

			const res = await app
				.post('/reviews')
				.set('Host', `${tenant.slug}.${appEnv.development_app_url}`)
				.set('Cookie', cookie)
				.send({
					csrfToken,
					user_id: user.id,
					tenant_id: tenant.id,
					comment: 'this is some bull shit',
					ratings: 5,
				});

			expect(res.status).toBe(302);

			const reviews = await db('reviews')
				.where({
					user_id: user.id,
					tenant_id: tenant.id,
				})
				.first();

			expect(reviews.comment).toEqual('this is some bull ****');
		});
	});
});
