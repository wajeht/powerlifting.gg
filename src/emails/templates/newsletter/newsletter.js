import ejs from 'ejs';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendNewsletterEmail({
	email,
	subject = `New post on ${domain}`,
	username,
	post,
}) {
	try {
		const newsletterHtml = await ejs.renderFile(`${import.meta.dirname}/newsletter.html`, {
			username,
			post,
		});

		await sendMail({
			to: email,
			subject,
			html: newsletterHtml,
		});

		logger.info('Newsletter email sent to:', email);
	} catch (error) {
		logger.alert('Error while sending newsletter email:', error);
		throw error;
	}
}
