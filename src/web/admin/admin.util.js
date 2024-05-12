import fs from 'node:fs/promises';
import path from 'node:path';

const dirPath = path.resolve(path.join(process.cwd(), 'src', 'logs'));

/**
 *
 * @param {string} dirPath  - as in `/Users/jaw/Dev/powerlifting.gg/src/logs`
 *
 */
export async function getLogFilePath(dirPath) {
	try {
		const files = await fs.readdir(dirPath);
		return files
			.filter((file) => file.endsWith('.log'))
			.map((file) => ({ path: path.join(dirPath, file), name: file }));
	} catch (error) {
		console.error('Error reading logs directory:', error);
		return [];
	}
}

/**
 *
 * @param {string} filePath  - as in `/Users/jaw/Dev/powerlifting.gg/src/logs/2024-05-12.log`
 *
 */
export async function transformLogToJSON(filePath) {
	try {
		const fileContents = await fs.readFile(filePath, 'utf-8');
		return fileContents
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));
	} catch (error) {
		console.error('Error transforming log to JSON:', error);
		return [];
	}
}

export async function getLogs() {
	try {
		const logs = [];
		const files = await getLogFilePath(dirPath);
		for (const file of files) {
			const json = await transformLogToJSON(file.path);
			logs.push({
				date: file.name,
				logs: json,
			});
		}
		return logs;
	} catch (error) {
		console.error('Error getting logs:', error);
		return [];
	}
}

/**
 *
 * @param {string} date - as in `2024-05-12` format
 *
 */
export async function getLog(date) {
	try {
		const [log] = (await getLogFilePath(dirPath)).filter(
			(log) => log.name.split('.log')[0] === date,
		);
		return await transformLogToJSON(log.path);
	} catch (error) {
		console.error('Error getting log:', error);
		return [];
	}
}

console.log(await getLogs());
