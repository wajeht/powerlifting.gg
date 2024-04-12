import { faker } from '@faker-js/faker';

export async function seed(db) {
	const tenantIds = await db('tenants').pluck('id');

	const reviews = [];

	for (const tenantId of tenantIds) {
		const userIds = await db('users').where('tenant_id', tenantId).pluck('id');

		const numberOfReviews = faker.number.int({ min: 1, max: 5 });

		for (let i = 0; i < numberOfReviews; i++) {
			const randomIndex = faker.number.int({ min: 0, max: userIds.length - 1 });
			const randomUserId = userIds[randomIndex];
			reviews.push({
				user_id: randomUserId,
				tenant_id: tenantId,
				comment: faker.lorem.sentence(),
				ratings: faker.number.int({ min: 1, max: 5 }),
				created_at: faker.date.between({
					from: '2020-01-01T00:00:00.000Z',
					to: '2030-01-01T00:00:00.000Z',
				}),
			});
		}
	}

	await db.batchInsert('reviews', reviews);
}
