import { app } from './app.js';
import { app as appConfig } from './config/app.js';
import { logger } from './utils/logger.js';
// import cp from 'child_process';
import { redis } from './database/db.js';

const server = app.listen(appConfig.port, async () => {
	logger.info(`Server was started on http://localhost:${appConfig.port}`);

	await redis.flushall();
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

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
