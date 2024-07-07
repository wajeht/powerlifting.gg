import ejs from 'ejs';
import path from 'node:path';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendWelcomeEmail({ email, subject = `Welcome to ${domain}`, username }) {
	try {
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'welcome', 'welcome.html'),
		);

		const welcomeTemplate = await ejs.renderFile(template, { username });

		await sendMail({
			to: email,
			subject,
			html: welcomeTemplate,
		});

		logger.info('welcome email sent to:', email);
	} catch (error) {
		logger.alert('error while sending welcome email:', error);
		throw error;
	}
}
