import { app } from './app.js';
import { app as appConfig } from './config/app.js';
import { logger } from './utils/logger.js';
import { job } from './job/job.js';
import { shell } from './utils/shell.js';

const server = app.listen(appConfig.port, async () => {
	logger.info(`Server was started on http://localhost:${appConfig.port}`);

	// commands
	if (appConfig.env === 'production') {
		await shell('powerlifting clear --cloudflare_cache');
	}

	await shell('powerlifting clear --redis_cache');

	// crons
	await job.scheduleBackupDatabaseJob();
	await job.sendNewsletterEmailJob();
	await job.cleanupDatabaseBackupJob({ amount: 5 });
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
	logger.alert('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
