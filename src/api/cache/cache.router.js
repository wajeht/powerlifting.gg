import express from 'express';

import { catchAsyncErrorHandler } from '../../app.middlewares.js';
import { redis } from '../../database/db.js';

const cache = express.Router();

cache.get(
	'/',
	catchAsyncErrorHandler(async (req, res) => {
		const keys = await redis.keys('*');

		if (req.query.data === 'true') {
			const data = {};
			for (const key of keys) {
				const value = await redis.get(key);
				data[key] = value;
			}

			return res.status(200).json({
				message: 'ok',
				data,
			});
		}

		return res.status(200).json({
			message: 'ok',
			data: keys,
		});
	}),
);

export { cache };
