import { app } from './app.js';
import { job } from './job/job.js';
import { shell } from './utils/shell.js';
import { logger } from './utils/logger.js';
import { app as appConfig } from './config/app.js';
import { db } from './database/db.js';

const server = app.listen(appConfig.port, async () => {
	try {
		logger.info(`Server was started on http://localhost:${appConfig.port}`);

		// commands
		if (appConfig.env === 'production') {
			await shell('powerlifting clear --cloudflare-cache');
		}

		await shell('powerlifting clear --redis-cache');

		// crons
		await job.scheduleBackupDatabaseJob();
		await job.sendNewsletterEmailJob();
		await job.cleanupDatabaseBackupJob({ amount: 5 });

	} catch (error) {
		logger.error(error);
	}
});

function gracefulShutdown(signal) {
	logger.info(`Received ${signal}, shutting down gracefully.`);

	server.close(async () => {
		try {
			logger.info('closing any db connection');
			await db.destroy();

			logger.info('HTTP server closed.');
			process.exit(0);

		} catch (error) {
			logger.error(error);
		}
	});

	setTimeout(() => {
		logger.error('Could not close connections in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

process.on('uncaughtException', async (error, origin) => {
	logger.error('Uncaught Exception:', error, 'Origin:', origin);
	gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason, promise) => {
	logger.error('Unhandled Rejection:', promise, 'reason:', reason);
	gracefulShutdown('unhandledRejection');
});
