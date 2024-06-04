import ejs from 'ejs';
import path from 'node:path';
import { sendMail, domain } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendApproveTenantEmail({ subject = 'Approve Tenant', tenant, coach }) {
	try {
		const template = path.resolve(
			path.join(
				process.cwd(),
				'src',
				'emails',
				'templates',
				'approve-tenant',
				'approve-tenant.html',
			),
		);

		const html = await ejs.renderFile(template, { tenant, coach, domain });

		await sendMail({
			subject,
			html,
		});
	} catch (error) {
		logger.alert('error while sending approve tenant email:', error);
		throw error;
	}
}
