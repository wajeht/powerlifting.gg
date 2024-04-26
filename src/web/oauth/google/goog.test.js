import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app as server } from '../../../app.js';
import { db } from '../../../database/db.js';
import { refreshDatabase } from '../../../tests/refresh-db.js';

await refreshDatabase();

const app = request(server);

vi.mock('./google.util.js', () => ({
	getGoogleOAuthURL: vi.fn(() => 'https://mocked-google-oauth-url.com'),
	getGoogleOauthToken: vi.fn(() =>
		Promise.resolve({
			id_token: 'mock_id_token',
			access_token: 'mock_access_token',
		}),
	),
	getGoogleUser: vi.fn(() =>
		Promise.resolve({
			email: 'user1@test.com',
			verified_email: true,
			picture: 'http://example.com/picture.jpg',
		}),
	),
}));

describe('/oauth/google', () => {
	it('should redirect to Google OAuth URL', async () => {
		const res = await app.get('/oauth/google');
		expect(res.status).toBe(302);
		expect(res.headers['location']).toBe('https://mocked-google-oauth-url.com');
	});
});

describe('/oauth/google/redirect', () => {
	it('should sign in an existing user and redirect', async () => {
		await db('users').insert({
			username: 'existing_user',
			email: 'user1@test.com',
			role: 'USER',
		});

		const res = await app.get('/oauth/google/redirect?code=1234');
		expect(res.status).toBe(302);

		const users = await db.select('*').from('users').where('email', 'user1@test.com');
		expect(users.length).toBe(1);
	});
});
