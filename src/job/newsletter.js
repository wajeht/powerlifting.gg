import dayjs from 'dayjs';
import { app as appConfig } from '../config/app.js';
import { job } from './job.js';
import { db, redis } from '../database/db.js';
import { WebService } from '../web/web.service.js';
import { WebRepository } from '../web/web.repository.js';

export async function startNewsletterEmailJob() {
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

	for (const user of users) {
		await job.sendNewsletterEmailJob({
			email: user.email,
			username: user.username,
			post: {
				title: post.meta.title,
				url: `http://${DOMAIN}/blog/${post.id}`,
			},
		});
	}
}
