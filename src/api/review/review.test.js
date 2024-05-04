import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from '../../app.js';
import { db } from '../../database/db.js';
import { refreshDatabase } from '../../tests/refresh-db.js';
import { app as appConfig } from '../../config/app.js';

const app = request(server);

await refreshDatabase();

describe('review', () => {
	it('should not be able to get random reviews with subdomain route', async () => {
		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');
		const res = await app
			.get('/api/reviews/random?size=1')
			.set('Host', `${tenant.slug}.${appConfig.development_app_url}`);
		expect(res.statusCode).toBe(404);
		expect(res.text).contain('Oops! The page you are looking for cannot be found.');
	});

	it('should be able to get no random reviews', async () => {
		const res = await app.get('/api/reviews/random?size=1');
		expect(res.statusCode).toBe(200);
		expect(res.body.data).toStrictEqual([]);
	});

	it('should be able to get random reviews', async () => {
		const [user] = await db('users')
			.insert({
				username: 'user1',
				email: 'user1@test.com',
				role: 'USER',
			})
			.returning('*');

		const [tenant] = await db('tenants')
			.insert({
				name: 'thanks',
				slug: 'obama',
				approved: true,
			})
			.returning('*');

		const [review] = await db('reviews')
			.insert({
				tenant_id: tenant.id,
				user_id: user.id,
				comment: 'thanks obama',
				ratings: 5,
				created_at: new Date(),
			})
			.returning('*');

		const res = await app.get('/api/reviews/random?size=1');
		expect(res.statusCode).toBe(200);
		expect(res.body.data[0].comment).toStrictEqual(review.comment);
	});
});
