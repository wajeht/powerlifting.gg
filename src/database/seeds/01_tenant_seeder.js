/* eslint-disable no-useless-escape */
import { faker } from '@faker-js/faker';

function sluggify(str) {
	return str
		.toLowerCase() // Convert to lowercase
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
		.replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-+/, '') // Remove leading hyphens
		.replace(/-+$/, ''); // Remove trailing hyphens
}

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
				emoji: faker.internet.emoji(),
				color: faker.color.rgb(),
				verified: Math.random() < 0.5,
				ratings: faker.number.float(),
			});
		}

		await db.batchInsert('tenants', tenants);
	}
}
