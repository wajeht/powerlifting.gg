import ejs from 'ejs';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendExportTenantReviewsEmail({
	subject = 'Reviews Export',
	user,
	tenant,
	downloadUrl,
}) {
	try {
		const exportTenantReviewsHtml = await ejs.renderFile(
			`${import.meta.dirname}/export-tenant-reviews.html`,
			{
				user,
				tenant,
				downloadUrl,
				email: user.email,
			},
		);

		await sendMail({
			to: user.email,
			subject,
			html: exportTenantReviewsHtml,
		});

		logger.info('export tenant reviews email sent to:', user.email);
	} catch (error) {
		logger.alert('error while sending export tenant reviews email:', error);
		throw error;
	}
}
