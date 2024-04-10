import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = Array.from({ length: 100 }, () => ({
		name: faker.company.name(),
		slug: faker.lorem.slug(),
		emoji: faker.internet.emoji(),
		color: faker.color.rgb(),
		verified: faker.datatype.boolean(),
		rating: faker.number.int(),
	}));

	await db('tenants').insert(tenants);
}
