import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = await db('tenants').pluck('id');

	const fixedUsers = [
		{
			username: 'super-admin',
			email: 'super-admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'SUPER_ADMIN',
		},
		{
			username: 'admin',
			email: 'admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'ADMIN',
		},
		{
			username: 'user',
			email: 'user@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'USER',
		},
	];

	for (const user of fixedUsers) {
		const existingUser = await db('users').where('email', user.email).first();
		if (!existingUser) {
			await db('users').insert({ ...user, tenant_id: tenants[0] });
		}
	}

	for (const tenantId of tenants) {
		const users = [];
		for (let i = 0; i < 3; i++) {
			let email = faker.internet.email();
			const existingUser = await db('users').where('email', email).first();
			while (existingUser) {
				email = faker.internet.email();
			}
			const username = faker.internet.userName();
			users.push({
				username: username,
				email: email,
				password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
				role: 'USER',
				tenant_id: tenantId,
			});
		}
		await db('users').insert(users);
	}
}
