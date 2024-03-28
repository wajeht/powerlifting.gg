import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { email as emailConfig } from '../conifg/email.js';

const transporter = nodemailer.createTransport(emailConfig);

export async function sendMail({ to, subject, html }) {
	const mailOptions = {
		from: `‼️ bang.jaw.dev <${emailConfig.email_alias}>`,
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
