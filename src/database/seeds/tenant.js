import { faker } from '@faker-js/faker';

export async function seed(db) {
	const fakeTenants = Array.from({ length: 5 }, () => ({
		name: faker.company.name(),
		slug: faker.lorem.slug(),
	}));

	await db('tenants').insert(fakeTenants);
}
