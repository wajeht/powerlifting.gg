import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendApproveTenantEmail({ email, subject = 'Approve Tenant', message }) {
	try {
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'contact', 'approve-tenant.html'),
		);
		const html = await ejs.renderFile(template, { email, subject, message });

		await sendMail({
			subject,
			html,
		});

		logger.info('approve tenant email sent to:', email);
	} catch (error) {
		logger.error('error while sending approve tenant email:', error);
		throw error;
	}
}
