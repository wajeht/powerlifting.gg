import express from 'express';

import { catchAsyncErrorHandler, tenantIdentityHandler } from '../../app.middlewares.js';
import { redis } from '../../database/db.js';
import { app as appConfig } from '../../config/app.js';
import { NotFoundError } from '../../app.errors.js';

const cache = express.Router();

cache.get(
	'/',
	tenantIdentityHandler,
	(req, res, next) => (req.tenant ? next(new NotFoundError()) : next()),
	catchAsyncErrorHandler(async (req, res) => {
		const keys = await redis.keys('*');

		// // TODO: this might not be a good idea
		// if (req.query.data === 'true') {
		// 	const data = {};

		// 	for (const key of keys) {
		// 		const value = await redis.get(key);

		// 		if (!key.includes(appConfig.session.store_prefix)) {
		// 			data[key] = value;
		// 		}
		// 	}

		// 	return res.status(200).json({
		// 		message: 'ok',
		// 		data,
		// 	});
		// }

		return res.status(200).json({
			message: 'ok',
			data: keys.filter((key) => !key.includes(appConfig.session.store_prefix)),
		});
	}),
);

export { cache };
