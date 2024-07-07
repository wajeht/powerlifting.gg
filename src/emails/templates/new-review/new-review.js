import ejs from 'ejs';
import { sendMail } from '../../mailer.util.js';
import { logger } from '../../../utils/logger.js';

export async function sendNewReviewEmail({ subject = 'New review', user, tenant, review }) {
	try {
		const newReviewHtml = await ejs.renderFile(`${import.meta.dirname}/new-review.html`, {
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
