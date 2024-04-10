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

				if (!key.includes('powerlifting-gg-session-store')) {
					data[key] = value;
				}
			}

			return res.status(200).json({
				message: 'ok',
				data,
			});
		}

		return res.status(200).json({
			message: 'ok',
			data: keys.filter((key) => !key.includes('powerlifting-gg-session-store')),
		});
	}),
);

export { cache };
