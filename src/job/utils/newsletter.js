import dayjs from 'dayjs';
import { app as appConfig } from '../../config/app.js';
import { db, redis } from '../../database/db.js';
import { WebService } from '../../web/web.service.js';
import { WebRepository } from '../../web/web.repository.js';
import { sendNewsletterEmail } from '../../emails/email.js';
import { logger } from '../../utils/logger.js';

// TODO: clean this up. make it testable
export async function sendNewsLetterEmailInBulk(job) {
	try {
		let DOMAIN = '';

		if (appConfig.env === 'production') {
			DOMAIN = appConfig.production_app_url;
		} else {
			DOMAIN = appConfig.development_app_url;
		}

		const posts = await WebService(WebRepository(db), redis, job).getBlogPosts({ cache: false });
		const post = posts[0];
		const postDate = dayjs(post.meta.date).format('YYYY-MM-DD');
		const todayDate = dayjs().format('YYYY-MM-DD');

		if (postDate !== todayDate) return;

		let users = await db
			.select('subscriptions.email as email', 'users.username as username')
			.from('subscriptions')
			.leftJoin('users', 'users.email', 'subscriptions.email')
			.where('type', 'like', '%"newsletter":true%');

		users = users.map((user) => {
			if (user.username === null) {
				// set usernames to those public users that is not tied to our systems
				return {
					...user,
					username: user.email.split('@')[0],
				};
			}
			return user;
		});

		job.updateProgress(0);

		for (const user of users) {
			await sendNewsletterEmail({
				email: user.email,
				username: user.username,
				post: {
					title: post.meta.title,
					url: `http://${DOMAIN}/blog/${post.meta.id}`,
				},
			});
			logger.info(`Newsletter email job  sent to ${user.email}`);
		}

		job.updateProgress(100);
	} catch (error) {
		logger.alert('failed to send newsletter email', error);
	}
}
