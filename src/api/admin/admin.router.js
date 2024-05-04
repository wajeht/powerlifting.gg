import express from 'express';
import { Tenant } from '../../database/models/Tenant.model.js';

import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../../app.middleware.js';
import { redis } from '../../database/db.js';

const admin = express.Router();

admin.post(
	'/cache/clear',
	tenantIdentityHandler,
	throwTenancyHandler,
	authenticationHandler,
	authorizePermissionHandler('SUPER_ADMIN'),
	catchAsyncErrorHandler(async (req, res) => {
		const keys = await redis.keys('*');

		for (const key of keys) {
			await redis.del(key);
		}

		return res.json({ message: 'ok' });
	}),
);

admin.get(
	'/tenant/:id',
	catchAsyncErrorHandler(async (req, res) => {
		const tenant = await Tenant.query().findById(req.params.id).withGraphFetched('reviews');
		return res.json({
			data: tenant,
		});
	}),
);

export { admin };
