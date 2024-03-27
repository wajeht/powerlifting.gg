import { app } from './app.js';
import { env } from './conifg/env.js';
import { logger } from './utils/logger.js';
import { generateTailwindColors } from './utils/tailwind.js';

const server = app.listen(env.port, async () => {
	await generateTailwindColors();
	logger.info(`Server was started on http://localhost:${env.port}`);
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
