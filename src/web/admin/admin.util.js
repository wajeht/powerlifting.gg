import fs from 'node:fs/promises';
import path from 'node:path';

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

export async function transformLogToJSON(filePath) {
	try {
		const fileContents = await fs.readFile(filePath, 'utf-8');
		if (fileContents.length === 0) return [];
		return fileContents
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));
	} catch (error) {
		console.error('Error transforming log to JSON:', error);
		return [];
	}
}

export async function getLogs(dirPath) {
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

export async function getLog({ date, dirPath }) {
	try {
		const [log] = (await getLogFilePath(dirPath)).filter(
			(log) => log.name.split('.log')[0] === date,
		);
		if (log) return await transformLogToJSON(log.path);
		return [];
	} catch (error) {
		console.error('Error getting log:', error);
		return [];
	}
}
