import fs from 'node:fs/promises';
import path from 'node:path';

const dirPath = path.resolve(path.join(process.cwd(), 'src', 'logs'));

/**
 *
 * @param {string} dirPath  - /Users/jaw/Dev/powerlifting.gg/src/logs
 * @returns
 */
export async function getLogFiles(dirPath) {
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
 * @param {string} filePath  - /Users/jaw/Dev/powerlifting.gg/src/logs/2024-05-12.log
 * @returns
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

/**
 *
 * @param {string} date - as in `2024-05-12` format
 * @returns
 */
export async function getLog(date) {
	try {
		const [log] = (await getLogFiles(dirPath)).filter((log) => log.name.split('.log')[0] === date);
		return await transformLogToJSON(log.path);
	} catch (error) {
		console.error('Error getting log:', error);
		return [];
	}
}

console.log(await getLog('2024-05-12'));
