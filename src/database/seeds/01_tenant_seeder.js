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

			const links = [];

			if (Math.random() < 0.5) {
				links.push({
					type: 'instagram',
					url: 'https://instagram.com',
				});
			}

			if (Math.random() < 0.5) {
				links.push({
					type: 'twitter',
					url: 'https://twitter.com',
				});
			}

			if (Math.random() < 0.5) {
				links.push({
					type: 'youtube',
					url: 'https://youtube.com',
				});
			}

			if (Math.random() < 0.5) {
				links.push({
					type: 'tiktok',
					url: 'https://tiktok.com',
				});
			}

			if (Math.random() < 0.5) {
				links.push({
					type: 'website',
					url: 'https://website.com',
				});
			}

			let approvedAndVerified = {
				approved: false,
				verified: false,
			};

			if (Math.random() < 0.5) {
				approvedAndVerified = {
					approved: true,
					verified: Math.random() < 0.5,
				};
			}

			tenants.push({
				links: JSON.stringify(links),
				name: name,
				slug: slug,
				ratings: faker.number.int({ min: 1, max: 5 }),
				...approvedAndVerified,
			});
		}

		await db.batchInsert('tenants', tenants);
	}
}
