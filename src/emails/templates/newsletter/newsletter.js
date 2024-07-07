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
		const layout = path.resolve(path.join(process.cwd(), 'src', 'emails', 'layouts', 'main.html'));
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'newsletter', 'newsletter.html'),
		);

		const newsletterTemplate = await ejs.renderFile(template, { username, post });
		const html = await ejs.renderFile(layout, { body: newsletterTemplate, domain, email });

		await sendMail({
			to: email,
			subject,
			html,
		});

		logger.info('Newsletter email sent to:', email);
	} catch (error) {
		logger.alert('Error while sending newsletter email:', error);
		throw error;
	}
}
