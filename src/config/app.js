import './env.js';

export const app = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	myIp: process.env.MY_IP_ADDRESS,
	production_app_url: process.env.PRODUCTION_APP_URL,
	development_app_url: process.env.DEVELOPMENT_APP_URL,
	session: {
		secret: process.env.SESSION_SECRET,
		store_prefix: process.env.SESSION_STORE_PREFIX,
	},
};
