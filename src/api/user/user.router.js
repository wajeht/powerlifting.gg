import express from 'express';

import { tenantIdentityHandler, catchAsyncErrorHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { UserService } from './user.service.js';
import { getTenantUsersHandler } from './user.handler.js';

const user = express.Router();

user.get(
	'/',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTenantUsersHandler(UserService(db))),
);

export { user };
