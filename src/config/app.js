import './env.js';

export const app = {
	super_admin_email: process.env.SUPER_ADMIN_EMAIL,
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	myIp: process.env.MY_IP_ADDRESS,
	production_app_url: process.env.PRODUCTION_APP_URL,
	development_app_url: process.env.DEVELOPMENT_APP_URL,
};
