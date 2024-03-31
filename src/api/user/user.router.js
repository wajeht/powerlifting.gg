import express from 'express';

import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	tenancyHandler,
} from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { UserService } from './user.service.js';
import { getTenantUsersHandler } from './user.handler.js';

const user = express.Router();

/**
 * GET {subdomain}/api/users
 * @tags users
 * @summary get all uers
 */
user.get(
	'/',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(getTenantUsersHandler(UserService(db))),
);

export { user };
