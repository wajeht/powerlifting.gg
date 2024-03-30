import { logger } from '../../../utils/logger.js';
import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';

export async function sendWelcomeEmail({ email, subject = 'Welcome to Subdomain', username }) {
	try {
		// prettier-ignore
		const template = path.resolve(path.join(process.cwd(), 'src', 'emails', 'templates', 'welcome','welcome.html'));
		const html = await ejs.renderFile(template, { username });

		await sendMail({
			to: email,
			subject,
			html,
		});

		logger.info('welcome email sent to:', email);
	} catch (error) {
		logger.error('error while sending welcome email:', error);
	}
}
