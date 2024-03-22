export const logger = {
	debug: (...value) => {
		if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
			const timestamp = new Date().toLocaleString();
			console.log(`\x1b[33m 🐛 ${timestamp} ${value}\x1b[0m`);
		}
	},
	error: (...value) => {
		const timestamp = new Date().toLocaleString();
		console.log(`\x1b[31m ❌ ${timestamp} ${value}\x1b[0m`);
	},
	info: (...value) => {
		const timestamp = new Date().toLocaleString();
		console.log(`\x1b[32m ✅ ${timestamp} ${value}️\x1b[0m`);
	},
};
