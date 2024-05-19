import dayjs from 'dayjs';
import { job } from './job.js';
import { db, redis } from '../database/db.js';
import { WebService } from '../web/web.service.js';
import { WebRepository } from '../web/web.repository.js';

let todayPost = await WebService(WebRepository(db), redis, job).getBlogPosts({ cache: false });
todayPost = dayjs(todayPost[0].meta.date).format('YYYY-MM-DD');

const today = dayjs().format('YYYY-MM-DD');

if (today === todayPost) {
	let users = await db
		.select('*')
		.from('subscriptions')
		.where('type', 'like', '%"newsletter":true%');

	for (const email of users) {
		await job.sendNewsletterEmailJob({
			email,
			username: 'xxx',
			post: 'xxx',
		});
	}
}
