import request from 'supertest';
import { it, expect, describe, vi } from 'vitest';
import { app as server } from '../app.js';
import { db } from '../database/db.js';
import { faker } from '@faker-js/faker';
import { refreshDatabase } from '../tests/refresh-db.js';
import { app as appEnv } from '../config/app.js';
import { login } from '../tests/login.js';
import { job } from '../job/job.js';

vi.mock('../job/job.js');

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

describe('getTenantsHandler', () => {
	it('should be able to get /tenants page', async () => {
		await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');

		const res = await app.get('/tenants');

		expect(res.statusCode).toBe(200);
		expect(res.text).contain('obama');
	});

	it('should not be able to get /tenants page with <subdomains>/tenants', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/tenants')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(404);
	});
});

describe('getTenantsCreateHandler', () => {
	it('should not be able to get /tenants/create page without auth', async () => {
		const res = await app.get('/tenants/create');
		expect(res.status).toBe(302);
	});

	it('should not be able to get /tenants/create page without auth and <subdomain>/tenants/create', async () => {
		const tenant = (
			await db('tenants')
				.insert({
					name: 'TenantName',
					approved: true,
					slug: 'tenant-slug',
				})
				.returning('*')
		)[0];
		const res = await app
			.get('/tenants/create')
			.set('Host', `${tenant.slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(404);
	});

	it('should be able to get /tenants/create page with auth', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		await db('tenants')
			.insert({
				name: 'TenantName',
				slug: 'tenant-slug',
				approved: true,
			})
			.returning('*');

		const { cookie } = await login(
			app,
			appEnv.development_app_url,
			'user1@test.com',
			'tenant-slug',
		);

		const res = await app.get('/tenants/create').set('Cookie', cookie);
		expect(res.status).toBe(200);
		expect(res.req.path).toBe('/tenants/create');
		expect(res.text).includes('Agreeing up signifies that you have read and agree to ');
	});
});

describe('postTenantHandler', () => {
	it('should not be able to post /tenants page without auth', async () => {
		const res = await app.post('/tenants');
		expect(res.status).toBe(302);
	});

	it('should not be able to post /tenants page without auth and <subdomain>/tenants', async () => {
		const tenant = (
			await db('tenants')
				.insert({
					name: 'TenantName',
					slug: 'tenant-slug',
					approved: true,
				})
				.returning('*')
		)[0];
		const res = await app
			.post('/tenants')
			.set('Host', `${tenant.slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(404);
	});

	it('should be able to post /tenants page with auth', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		expect((await db.select('*').from('tenants')).length).toBe(0);

		const { cookie, csrfToken } = await login(app, appEnv.development_app_url, 'user1@test.com');

		const res = await app.post('/tenants').set('Cookie', cookie).send({
			csrfToken,
			name: 'dog',
			slug: 'dog',
			agree: 'on',
		});
		expect(res.status).toBe(302);
		expect(res.header.location).toBe('/tenants/create');

		const tenant = await db.select('*').from('tenants').where({ slug: 'dog' }).first();
		expect(tenant.slug).toBe('dog');
		expect(job.sendApproveTenantEmailJob).toHaveBeenCalledTimes(1);
		expect(job.sendApproveTenantEmailJob).toHaveBeenCalledWith(tenant);
	});

	it('should return validation error when create a tenant via /tenants without required fields', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		const { cookie, csrfToken } = await login(app, appEnv.development_app_url, 'user1@test.com');

		const res = await app.post('/tenants').set('Cookie', cookie).send({
			csrfToken,
		});
		expect(res.status).toBe(302);
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
				approved: true,
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
				approved: true,
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

describe('postContactHandler', () => {
	it('should not be able to post /contact page with tenant domain', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.post('/contact')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should be able to post /contact page', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		// grab csrfToken from login, we need to better rename this
		// function to something else instead of being `login`
		const { cookie, csrfToken } = await login(app, appEnv.development_app_url, 'user1@test.com');

		const res = await app
			.post(`/contact`)
			.send({
				csrfToken,
				subject: 'x',
				message: 'x',
				email: 'email@email.com',
			})
			.set('Cookie', cookie); // need to sends cookie

		expect(res.statusCode).toBe(302);
		expect(job.sendContactEmailJob).toHaveBeenCalledTimes(1);
		expect(job.sendContactEmailJob).toHaveBeenCalledWith({
			subject: 'x',
			message: 'x',
			email: 'email@email.com',
		});
	});
});

describe('getLoginHandler', () => {
	it('should redirect to /oauth/google when visiting /login', async () => {
		const res = await app.get('/login');
		expect(res.status).toBe(302);
	});

	it('should redirect to /oauth/google when visiting <subdomain>/login', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/login')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(302);
	});
});

describe('getSettingsHandler', () => {
	it('should not be able to get /settings page without auth', async () => {
		const res = await app.get('/settings');
		expect(res.status).toBe(302);
	});

	it('should not be able to get /settings page with <subdomain>/subdomain', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/settings')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(404);
	});

	it('should be able to get /settings page with auth', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		await db('tenants')
			.insert({
				name: 'TenantName',
				slug: 'tenant-slug',
				approved: true,
			})
			.returning('*');

		const { cookie } = await login(
			app,
			appEnv.development_app_url,
			'user1@test.com',
			'tenant-slug',
		);

		const res = await app.get('/settings').set('Cookie', cookie);
		expect(res.status).toBe(200);
		expect(res.req.path).toBe('/settings');
		expect(res.text).includes('Settings');
		expect(res.text).includes('Exciting updates are on the way! Our website is current');
	});
});

describe('getContactHandler', () => {
	it('should be able to get /contact', async () => {
		const res = await app.get('/contact');
		expect(res.status).toBe(200);
		expect(res.req.path).toBe('/contact');
	});

	it('should not be able to get /contact with <subdomain>/contact', async () => {
		const tenant = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/contact')
			.set('Host', `${tenant[0].slug}.${appEnv.development_app_url}`);
		expect(res.status).toBe(404);
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
						approved: true,
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

describe('/admin/jobs', () => {
	it('should not able to reach <subdomain>/admin/jobs', async () => {
		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/admin/jobs')
			.set('Host', `${tenant.slug}.${appEnv.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should not able to reach /admin/jobs if current user is not SUPER_ADMIN', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		const { cookie } = await login(app, appEnv.development_app_url, 'user1@test.com');
		const res = await app.get('/admin/jobs').set('Cookie', cookie);
		expect(res.statusCode).toBe(404);
	});

	it.skip('should able to reach /admin/jobs if current user is SUPER_ADMIN', async () => {
		await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'SUPER_ADMIN',
			})
			.returning('*');

		const { cookie } = await login(app, appEnv.development_app_url, 'user1@test.com');
		const res = await app.get('/admin/jobs').set('Cookie', cookie);
		console.log(res.text);
		expect(res.statusCode).toBe(200);
	});
});
