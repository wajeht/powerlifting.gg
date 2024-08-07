import { exec } from 'child_process';

export async function shell(command) {
	return new Promise((resolve, reject) => {
		const childProcess = exec(command, {
			env: process.env,
		});

		if (childProcess.stdout) {
			childProcess.stdout.on('data', (data) => {
				console.log(data.toString());
			});
		}

		if (childProcess.stderr) {
			childProcess.stderr.on('data', (data) => {
				console.error(data.toString());
			});
		}

		childProcess.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command failed with exit code ${code}`));
			}
		});

		childProcess.on('error', (error) => {
			reject(new Error(`Exec error: ${error}`));
		});
	});
}
