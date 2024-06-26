import fs from 'fs';
import path from 'path';
import { db } from '../database/db.js';
import { logger } from '../utils/logger.js';
import { app as appConfig } from '../config/app.js';

if (appConfig.env !== 'production') {
	throw new Error('cannot use prepare-db.js in none production environment!');
}

const dbPath = path.resolve(path.join(process.cwd(), 'src', 'database', 'db.sqlite'));

fs.access(dbPath, fs.constants.F_OK, async (err) => {
	if (err) {
		console.log('Database does not exist. Creating...');

		fs.writeFileSync(dbPath, '');
		fs.chmodSync(dbPath, '0600');

		try {
			await db.migrate.latest();
			logger.info('Migrations are up to date.');
		} catch (error) {
			logger.alert(`Error running migrations or seeding: ${error}`);
		}

		await db.destroy();
	} else {
		logger.info('Database exists. Running migrations if needed...');

		try {
			await db.migrate.latest();
			logger.info('Migrations are up to date.');
		} catch (error) {
			logger.alert(`Error running migrations: ${error}`);
		}

		await db.destroy();
	}

	process.exit();
});
