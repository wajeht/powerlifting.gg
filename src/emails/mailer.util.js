import nodemailer from 'nodemailer';

import { email as emailConfig } from '../conifg/email.js';

const transporter = nodemailer.createTransport(emailConfig);

// prettier-ignore
export async function sendMail({ to, subject, html, from = `powerlifting.gg <${emailConfig.email_alias}>` }) {
	return await transporter.sendMail({
		from,
		to,
		subject,
		html,
	});
}
