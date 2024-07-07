import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendApproveTenantEmail({ subject = 'Approve Tenant', tenant, coach }) {
	try {
		const approveTenantTemplate = path.resolve(
			path.join(
				process.cwd(),
				'src',
				'emails',
				'templates',
				'approve-tenant',
				'approve-tenant.html',
			),
		);

		const approveTenantHtml = await ejs.renderFile(approveTenantTemplate, { tenant, coach });

		await sendMail({
			subject,
			html: approveTenantHtml,
		});

		logger.info('approve tenant email sent to super admin');
	} catch (error) {
		logger.alert('error while sending approve tenant email:', error);
		throw error;
	}
}
