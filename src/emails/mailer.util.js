import nodemailer from 'nodemailer';

import { email as emailConfig } from '../config/email.js';
import { app as appConfig } from '../config/app.js';

const transporter = nodemailer.createTransport(emailConfig);

export const domain =
	appConfig.env === 'production' ? appConfig.production_app_url : appConfig.development_app_url;

export async function sendMail({
	to = `${domain} <${emailConfig.email_alias}>`,
	subject,
	html,
	from = `${domain} <${emailConfig.email_alias}>`,
}) {
	return await transporter.sendMail({
		from,
		to,
		subject,
		html,
	});
}
