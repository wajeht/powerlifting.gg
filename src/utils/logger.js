// export const logger = {
// 	debug: (...value) => {
// 		if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
// 			const timestamp = new Date().toLocaleString();
// 			console.debug(`\x1b[33m 🐛 ${timestamp}`, ...value, '\x1b[0m');
// 		}
// 	},
// 	error: (...value) => {
// 		const timestamp = new Date().toLocaleString();
// 		console.error(`\x1b[31m ❌ ${timestamp}`, ...value, '\x1b[0m');
// 	},
// 	info: (...value) => {
// 		const timestamp = new Date().toLocaleString();
// 		console.info(`\x1b[32m ✅ ${timestamp}`, ...value, '\x1b[0m');
// 	},
// };

import path from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';

const today = new Date().toISOString().split('T')[0];
const root = path.resolve(process.cwd());

const levels = {
	// emerg: 80,
	// alert: 70,
	// crit: 60,
	// error: 50,
	// warn: 40,
	// notice: 30,
	// info: 20,
	// debug: 10,
};

const streams = [
	{ stream: pino.destination(`${root}/src/logs/${today}.log`) },
	// // this will print to the console
	{
		stream: pretty({
			translateTime: 'yyyy-mm-dd HH:MM:ss TT',
			colorize: true,
			sync: true,
			ignore: 'hostname,pid',
		}),
	},
];

export const logger = pino(
	{
		customLevels: levels,
		level: process.env.PINO_LOG_LEVEL || 'info',
		useOnlyCustomProps: true,
		formatters: {
			level: (label) => {
				return { level: label };
			},
		},
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	pino.multistream(streams),
);
