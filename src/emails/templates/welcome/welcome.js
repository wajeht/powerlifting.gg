import ejs from 'ejs';
import path from 'node:path';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendWelcomeEmail({
	email,
	subject = 'Welcome to powerlifting.gg',
	username,
}) {
	try {
		const layout = path.resolve(path.join(process.cwd(), 'src', 'emails', 'layouts', 'main.html'));
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'welcome', 'welcome.html'),
		);

		const body = await ejs.renderFile(template, { username });
		const html = await ejs.renderFile(layout, { body, domain, email });

		await sendMail({
			to: email,
			subject,
			html,
		});

		logger.info('welcome email sent to:', email);
	} catch (error) {
		logger.alert('error while sending welcome email:', error);
		throw error;
	}
}
