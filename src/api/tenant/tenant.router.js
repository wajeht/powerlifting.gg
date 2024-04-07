import express from 'express';

import { tenantIdentityHandler, catchAsyncErrorHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { TenantService } from './tenant.service.js';
import { getTenantHandler, getAllTenantHandler } from './tenant.handler.js';

const tenant = express.Router();

tenant.get('/', catchAsyncErrorHandler(getAllTenantHandler(TenantService(db))));

tenant.get(
	'/:id',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTenantHandler(TenantService(db))),
);

export { tenant };
