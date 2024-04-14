import nodemailer from 'nodemailer';

import { email as emailConfig } from '../config/email.js';

const transporter = nodemailer.createTransport(emailConfig);

export async function sendMail({
	to = `powerlifting.gg <${emailConfig.email_alias}>`,
	subject,
	html,
	from = `powerlifting.gg <${emailConfig.email_alias}>`,
}) {
	return await transporter.sendMail({
		from,
		to,
		subject,
		html,
	});
}
