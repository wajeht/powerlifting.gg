import { faker } from '@faker-js/faker';
import { comments } from '../../utils/comments.js';

export async function seed(db) {
	const users = await db.select('*').from('users');

	const reviews = [];

	for (const user of users) {
		const numberOfReviews = faker.number.int({ min: 1, max: 100 });

		for (let i = 0; i < numberOfReviews; i++) {
			const tenant = await db.select('*').from('tenants').orderByRaw('RANDOM()').first();
			const randomComment = comments[Math.floor(Math.random() * comments.length)];

			reviews.push({
				tenant_id: tenant.id,
				user_id: user.id,
				comment: randomComment,
				ratings: faker.number.int({ min: 1, max: 5 }),
				created_at: faker.date
					.between({
						from: '2012-01-01T00:00:00.000Z',
						to: '2024-01-03T00:00:00.000Z',
					})
					.toISOString(),
			});
		}
	}

	await db.batchInsert('reviews', reviews);
}
