import ejs from 'ejs';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendContactEmail({ email, subject = 'Contact', message }) {
	try {
		const contactHtml = await ejs.renderFile(`${import.meta.dirname}/contact.html`, {
			email,
			subject,
			message,
		});

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
