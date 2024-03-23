import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = await db('tenants').select('id');

	for (const tenant of tenants) {
		const users = Array.from({ length: 3 }, () => ({
			email: faker.internet.email(),
			password: faker.internet.password(),
			tenant_id: tenant.id,
		}));

		await db('users').insert(users);
	}
}
