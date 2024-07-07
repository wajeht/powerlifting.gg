import ejs from 'ejs';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendWelcomeEmail({ email, subject = `Welcome to ${domain}`, username }) {
	try {
		const welcomeHtml = await ejs.renderFile(`${import.meta.dirname}/welcome.html`, { username });

		await sendMail({
			to: email,
			subject,
			html: welcomeHtml,
		});

		logger.info('welcome email sent to:', email);
	} catch (error) {
		logger.alert('error while sending welcome email:', error);
		throw error;
	}
}
