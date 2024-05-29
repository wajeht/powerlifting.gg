import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendNewReviewEmail({ subject = 'New review', user, tenant, review }) {
	try {
		const template = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'new-review', 'new-review.html'),
		);

		const html = await ejs.renderFile(template, { user, tenant, review });

		await sendMail({
			subject,
			html,
		});
	} catch (error) {
		logger.alert('error while sending approve tenant email:', error);
		throw error;
	}
}
