import { faker } from '@faker-js/faker';

export async function seed(db) {
	const batchSize = 100;
	const totalTenants = 500;
	const batches = Math.ceil(totalTenants / batchSize);

	for (let i = 0; i < batches; i++) {
		const tenants = Array.from({ length: batchSize }, () => ({
			name: faker.company.name(),
			slug: faker.lorem.slug(),
			emoji: faker.internet.emoji(),
			color: faker.color.rgb(),
			verified: Math.random() < 0.5,
			ratings: faker.number.float(),
		}));

		await db.batchInsert('tenants', tenants);
	}
}
