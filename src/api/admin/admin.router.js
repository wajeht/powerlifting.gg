import express from 'express';
import { roles } from '../../utils/constants.js';

import {
	authenticationHandler,
	authorizePermissionHandler,
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
	authorizePermissionHandler(roles.SUPER_ADMIN),
	async (req, res) => {
		const keys = await redis.keys('*');

		for (const key of keys) {
			await redis.del(key);
		}

		return res.json({ message: 'ok' });
	});

export { admin };
