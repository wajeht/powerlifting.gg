// import cp from 'child_process';

// // Get the current date and time
// const currentDate = new Date().toISOString().replace(/:/g, '-'); // Replace ':' with '-' to make it compatible with file names
// const backupFileName = `db-${currentDate}.sqlite`;

// // Construct the backup command with the updated file name
// // const backupCommand = `sqlite3 ./src/database/db.sqlite '.backup ./src/database/backup/${backupFileName}'`;
// const backupCommand = `sqlite3 ./src/database/db.sqlite "VACUUM INTO './src/database/backup/${backupFileName}'"`;

// cp.exec(backupCommand, (error, stdout, stderr) => {
// 	if (error) {
// 		console.error(`Error executing backup command: ${error}`);
// 		return;
// 	}
// 	if (stderr) {
// 		console.error(`Error during backup: ${stderr}`);
// 		return;
// 	}
// 	console.log(`Backup successful: ${stdout}`);

// 	// Gzip the backup file after successful backup
// 	cp.exec(`gzip ./src/database/backup/${backupFileName}`, (gzipError, gzipStdout, gzipStderr) => {
// 		if (gzipError) {
// 			console.error(`Error executing gzip command: ${gzipError}`);
// 			return;
// 		}
// 		if (gzipStderr) {
// 			console.error(`Error during gzip: ${gzipStderr}`);
// 			return;
// 		}
// 		console.log(`Gzip successful: ${gzipStdout}`);
// 	});
// });

// import { redis } from '../database/db.js';

// const keys = await redis.keys('*');

// for (const i of keys) {
// 	const	key = await redis.get(i);
// 	if (key.includes('tenants-36-reviews')) {
// 		await redis.del(key);
// 	}
// }
