import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = await db('tenants').pluck('id');

	const fixedUsers = [
		{
			username: 'super-admin',
			email: 'super-admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'SUPER_ADMIN',
			emoji: '💪',
		},
		{
			username: 'admin',
			email: 'admin@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'ADMIN',
			emoji: '👨‍💼',
		},
		{
			username: 'user',
			email: 'user@test.com',
			password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
			role: 'USER',
			emoji: '🤓',
		},
	];

	await db('users').insert(fixedUsers.map((user) => ({ ...user, tenant_id: tenants[0] })));

	for (const tenant_id of tenants) {
		const users = [];
		const existingUsernames = new Set();
		const existingEmails = new Set();

		// Generate unique users
		for (let i = 0; i < 3; i++) {
			let username = faker.internet.userName();
			let email = faker.internet.email();

			// Ensure username uniqueness
			while (existingUsernames.has(username)) {
				username = faker.internet.userName();
			}
			existingUsernames.add(username);

			// Ensure email uniqueness
			while (existingEmails.has(email)) {
				email = faker.internet.email();
			}
			existingEmails.add(email);

			users.push({
				username: username,
				email: email,
				password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
				role: 'USER',
				emoji: faker.internet.emoji(),
				tenant_id: tenant_id,
			});
		}

		// Bulk insert generated users
		await db('users').insert(users);
	}
}
