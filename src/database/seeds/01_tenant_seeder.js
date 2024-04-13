import { faker } from '@faker-js/faker';
import { sluggify } from '../../utils/sluggify.js';

export async function seed(db) {
	const batchSize = 10;
	const totalTenants = 100;
	const batches = Math.ceil(totalTenants / batchSize);

	for (let i = 0; i < batches; i++) {
		const tenants = [];

		for (let j = 0; j < batchSize; j++) {
			const name = faker.company.name();
			let slug = sluggify(name);

			let suffix = 1;
			let slugExists = await db('tenants').where('slug', slug).first();
			while (slugExists) {
				slug = `${slug}-${suffix}`;
				slugExists = await db('tenants').where('slug', slug).first();
				suffix++;
			}

			tenants.push({
				name: name,
				slug: slug,
				verified: Math.random() < 0.5,
				ratings: faker.number.int({ min: 1, max: 5 }),
			});
		}

		await db.batchInsert('tenants', tenants);
	}
}
