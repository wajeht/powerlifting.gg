import ejs from 'ejs';
import path from 'node:path';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendNewsletterEmail({
	email,
	subject = `New post on ${domain}`,
	username,
	post,
}) {
	try {
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'newsletter', 'newsletter.html'),
		);

		const newsletterTemplate = await ejs.renderFile(template, { username, post });

		await sendMail({
			to: email,
			subject,
			html: newsletterTemplate,
		});

		logger.info('Newsletter email sent to:', email);
	} catch (error) {
		logger.alert('Error while sending newsletter email:', error);
		throw error;
	}
}
