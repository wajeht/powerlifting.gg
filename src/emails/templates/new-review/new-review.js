import ejs from 'ejs';
import path from 'node:path';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendNewReviewEmail({ subject = 'New review', user, tenant, review }) {
	try {
		const newReviewTemplate = path.resolve(
			path.join(process.cwd(), 'src', 'emails', 'templates', 'new-review', 'new-review.html'),
		);

		const newReviewHtml = await ejs.renderFile(newReviewTemplate, {
			user,
			tenant,
			review,
			email: user.email,
		});

		await sendMail({
			to: user.email,
			subject,
			html: newReviewHtml,
		});
	} catch (error) {
		logger.alert('error while sending approve tenant email:', error);
		throw error;
	}
}
