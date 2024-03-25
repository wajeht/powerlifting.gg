import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = await db('tenants').select('id');

	for (const tenant of tenants) {
		const users = Array.from({ length: 3 }, () => ({
			username: faker.internet.userName(),
			email: faker.internet.email(),
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
			role: 'USER',
			emoji: faker.internet.emoji(),
			tenant_id: tenant.id,
		}));

		await db('users').insert(users);
	}

	const users = [
		{
			username: 'super-admin',
			email: 'super-admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
			role: 'SUPER_ADMIN',
			emoji: '💪',
			tenant_id: tenants[0].id,
		},
		{
			username: 'admin',
			email: 'admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
			role: 'ADMIN',
			emoji: '👨‍💼',
			tenant_id: tenants[0].id,
		},
		{
			username: 'user',
			email: 'user@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O', // password - with bcrypjs hashed 10
			role: 'USER',
			emoji: '🤓',
			tenant_id: tenants[0].id,
		},
	];

	await db('users').insert(users);
}
