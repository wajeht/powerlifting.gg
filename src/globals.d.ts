// globals.d.ts
import type { Logger } from 'pino';

declare global {
	// ./utils/logger.js
	var logger: Logger;
}

export {};
