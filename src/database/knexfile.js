import path from 'path';
import { fileURLToPath } from 'url';
import { app as appConfig } from '../config/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const developmentEnvironmentOnly = ['production', 'testing'].includes(!appConfig.env);

const knexConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: path.resolve(__dirname, 'db.sqlite'),
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: path.resolve(__dirname, './migrations'),
	},
	debug: developmentEnvironmentOnly,
	seeds: { directory: path.resolve(__dirname, './seeds') },
	pool: {
		afterCreate: (conn, done) => {
			conn.run('PRAGMA foreign_keys = ON', (err) => {
				if (err) return done(err);
				conn.run('PRAGMA journal_mode = WAL', (err) => {
					if (err) return done(err);
					conn.run('PRAGMA synchronous = NORMAL', (err) => {
						if (err) return done(err);
						// Adjusts the number of pages in the memory cache
						conn.run('PRAGMA cache_size = 10000', (err) => {
							if (err) return done(err);
							// Stores temp objects in memory
							conn.run('PRAGMA temp_store = MEMORY', (err) => {
								if (err) return done(err);
								// Wait for 5000 ms before timing out
								conn.run('PRAGMA busy_timeout = 5000', done);
							});
						});
					});
				});
			});
		},
	},
};

if (process.env.NODE_ENV === 'testing') {
	knexConfig.connection = {
		filename: ':memory:',
	};
}

export default knexConfig;
