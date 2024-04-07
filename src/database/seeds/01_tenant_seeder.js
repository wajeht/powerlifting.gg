import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = Array.from({ length: 10 }, () => ({
		name: faker.company.name(),
		slug: faker.lorem.slug(),
		emoji: faker.internet.emoji(),
		color: faker.color.rgb(),
	}));

	await db('tenants').insert(tenants);
}
