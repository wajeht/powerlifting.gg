import nodemailer from 'nodemailer';

import { email as emailConfig } from '../config/email.js';
import { app as appConfig } from '../config/app.js';

const transporter = nodemailer.createTransport(emailConfig);

const url =
	appConfig.env === 'production' ? appConfig.production_app_url : appConfig.development_app_url;

export async function sendMail({
	to = `${url} <${emailConfig.email_alias}>`,
	subject,
	html,
	from = `${url} <${emailConfig.email_alias}>`,
}) {
	return await transporter.sendMail({
		from,
		to,
		subject,
		html,
	});
}
