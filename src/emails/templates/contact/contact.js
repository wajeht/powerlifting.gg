import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendContactEmail({ email, subject = 'Contact', message }) {
	try {
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'contact', 'contact.html'),
		);
		const html = await ejs.renderFile(template, { email, subject, message });

		await sendMail({
			subject,
			html,
		});

		logger.info('contact email sent to:', email);
	} catch (error) {
		logger.error('error while sending contact email:', error);
		throw error;
	}
}
