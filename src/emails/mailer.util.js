import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'node:path';

import { email as emailConfig } from '../config/email.js';
import { app as appConfig } from '../config/app.js';

const transporter = nodemailer.createTransport(emailConfig);

export const domain = appConfig.env === 'production' ? appConfig.production_app_url : appConfig.development_app_url; // prettier-ignore

export async function sendMail({
	to = `${domain} <${emailConfig.email_alias}>`,
	subject,
	html,
	from = `${domain} <${emailConfig.email_alias}>`,
}) {
	try {
		const layout = path.resolve(path.join(process.cwd(), 'src', 'emails', 'layouts', 'main.html'));
		const content = await ejs.renderFile(layout, { body: html, domain, email: to });

		await transporter.sendMail({
			from,
			to,
			subject,
			html: content,
		});

		logger.info('email sent to:', to);
	} catch (error) {
		logger.alert('error while sending email:', error);
	}
}
