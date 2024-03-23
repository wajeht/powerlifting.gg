import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenants = Array.from({ length: 5 }, () => ({
		name: faker.company.name(),
		slug: faker.lorem.slug(),
		logo_url: faker.image.url({
			width: 100,
			height: 100,
		}),
		color: faker.color.rgb(),
	}));

	await db('tenants').insert(tenants);
}
