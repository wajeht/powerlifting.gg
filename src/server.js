import { app } from './app.js';
import { app as appConfig } from './config/app.js';
import { session as sessionConfig } from './config/session.js';
import { logger } from './utils/logger.js';
import { redis } from './database/db.js';
import { job } from './job/job.js';

const server = app.listen(appConfig.port, async () => {
	logger.info(`Server was started on http://localhost:${appConfig.port}`);

	// start of the server might contains new migrations
	// we need to flush old cache
	//
	// TODO: refactor this later
	const keys = await redis.keys('*');
	for (const key of keys) {
		// dont flush session data so we web deploy new version
		// it does not logout current users
		//
		// only flash `cached` questions
		if (!key.startsWith('bull:') && !key.startsWith(sessionConfig.store_prefix)) {
			await redis.del(key);
		}
	}

	// crons
	await job.scheduleBackupDatabaseJob();
});

function gracefulShutdown() {
	logger.info('Received kill signal, shutting down gracefully.');
	server.close(() => {
		logger.info('HTTP server closed.');
		process.exit(0);
	});
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', async (reason, promise) => {
	logger.error('Unhandled Rejection at: ', await promise(), ' reason: ', reason);
});
