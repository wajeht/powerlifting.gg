import express from 'express';

import { catchAsyncErrorHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';

const reviews = express.Router();

reviews.get(
	'/random',
	catchAsyncErrorHandler(async (req, res) => {
		const size = req.query.size || 5;

		const data = await db('reviews')
			.select('reviews.*', 'users.username')
			.join('users', 'reviews.user_id', 'users.id')
			.orderByRaw('RANDOM()')
			.limit(size);

		return res.json({ message: 'ok', data });
	}),
);

export { reviews };
