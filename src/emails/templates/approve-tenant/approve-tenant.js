import ejs from 'ejs';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendApproveTenantEmail({ subject = 'Approve Tenant', tenant, coach }) {
	try {
		const approveTenantHtml = await ejs.renderFile(`${import.meta.dirname}/approve-tenant.html`, {
			tenant,
			coach,
		});

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
