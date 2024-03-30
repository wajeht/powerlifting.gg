import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { email as emailConfig } from '../conifg/email.js';

const transporter = nodemailer.createTransport(emailConfig);

export async function sendMail({
	to,
	subject,
	html,
	from = `${emailConfig.auth.user} <${emailConfig.email_alias}>`,
}) {
	const mailOptions = {
		from,
		to,
		subject,
		html,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		logger.error('Error while sending mail: ', error);
	}
}
