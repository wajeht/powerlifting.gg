import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendContactEmail({ email, subject = 'Contact', message }) {
	try {
		const contactTemplate = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'contact', 'contact.html'),
		);

		const contactHtml = await ejs.renderFile(contactTemplate, { email, subject, message });

		await sendMail({
			subject,
			html: contactHtml,
		});

		logger.info('contact email sent to:', email);
	} catch (error) {
		logger.alert('error while sending contact email:', error);
		throw error;
	}
}
