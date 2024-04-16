import path from 'path';
import { fileURLToPath } from 'url';
import { app as appConfig } from '../config/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	debug: appConfig.env !== 'production',
	seeds: { directory: path.resolve(__dirname, './seeds') },
	pool: {
		afterCreate: (conn, done) => {
			conn.run('PRAGMA foreign_keys = ON', done);
			conn.run('PRAGMA journal_mode = WAL', done);
			conn.run('PRAGMA synchronous = NORMAL', done);
			conn.run('PRAGMA cache_size = 10000', done); // Adjusts the number of pages in the memory cache
			conn.run('PRAGMA temp_store = MEMORY', done); // Stores temp objects in memory
			conn.run('PRAGMA busy_timeout = 5000', done); // Wait for 5000 ms before timing out
		},
	},
};

if (process.env.NODE_ENV === 'testing') {
	knexConfig.connection = {
		filename: ':memory:',
	};
}

export default knexConfig;
