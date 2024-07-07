import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendExportTenantReviewsEmail({
	subject = 'Reviews Export',
	user,
	tenant,
	downloadUrl,
}) {
	try {
		const template = path.resolve(
			path.join(
				process.cwd(),
				'src',
				'emails',
				'templates',
				'export-tenant-reviews',
				'export-tenant-reviews.html',
			),
		);

		const exportTenantReviewsHtml = await ejs.renderFile(template, {
			user,
			tenant,
			downloadUrl,
			email: user.email,
		});

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
