import './env.js';

export const email = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	email_alias: process.env.EMAIL_AUTH_ALIAS,
	auth: {
		user: process.env.EMAIL_AUTH_EMAIL,
		pass: process.env.EMAIL_AUTH_PASS,
	},
};
