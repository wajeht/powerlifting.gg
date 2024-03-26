import { db } from '../database/db.js';
import { beforeAll, afterEach, afterAll } from 'vitest';

if (process.env.NODE_ENV !== 'testing') {
	throw new Error('cannot use refreshDatabase() in none testing environment!');
}

process.env.NODE_ENV = 'testing';

export async function refreshDatabase() {
	beforeAll(async () => {
		await db.migrate.latest();
	});

	afterEach(async () => {
		// list in order to take care of foreign_key
		const tables = ['users', 'tenants'];

		for (const table of tables) {
			await db(table).truncate();
		}
	});

	afterAll(async () => {
		await db.migrate.rollback();
		await db.destroy();
	});
}
