import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = await db('tenants').select('id');

	for (const tenant of tenants) {
		const users = Array.from({ length: 3 }, () => ({
			email: faker.internet.email(),
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
			role: 'USER',
			tenant_id: tenant.id,
		}));

		await db('users').insert(users);
	}

	await db('users').insert({
		email: 'admin@test.com',
		password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
		role: 'ADMIN',
		tenant_id: tenants[0].id,
	});
}
