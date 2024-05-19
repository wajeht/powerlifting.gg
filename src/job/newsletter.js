import { db } from '../database/db.js';

let users = await db
	.select('*')
	.from('subscriptions')
	.where('preferences', 'like', '%"newsletter":true%');

console.log(users);
