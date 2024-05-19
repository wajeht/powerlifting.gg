import { faker } from '@faker-js/faker';

export async function seed(db) {
	const users = await db.select('*').from('users');

	const subscriptions = [];

	for (const user of users) {
		const subscription = {
			newsletter: faker.datatype.boolean(),
			changelog: faker.datatype.boolean(),
			promotions: faker.datatype.boolean(),
		};

		subscriptions.push({ email: user.email, type: JSON.stringify(subscription) });
	}

	// Add subscriptions for public users
	for (let i = 0; i < 5; i++) {
		const subscription = {
			newsletter: faker.datatype.boolean(),
			changelog: faker.datatype.boolean(),
			promotions: faker.datatype.boolean(),
		};

		subscriptions.push({ email: faker.internet.email(), type: JSON.stringify(subscription) });
	}

	await db.batchInsert('subscriptions', subscriptions);
}
