import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import badWord from 'bad-words';
import express from 'express';
import { catchAsyncErrorHandler, tenantIdentityHandler } from '../../app.middleware.js';
import { db, redis } from '../../database/db.js';
import { TenantService } from './tenant.service.js';
import { getTenantHandler, getAllTenantHandler } from './tenant.handler.js';
dayjs.extend(relativeTime);

const tenant = express.Router();

/**
 * GET /api/tenants
 * @tags api/tenants
 * @summary get tenants
 */
tenant.get(
	'/',
	catchAsyncErrorHandler(getAllTenantHandler(TenantService(db, redis, dayjs, badWord))),
);

/**
 * GET /api/tenants/{id}
 * @tags api/tenants
 * @summary get a specific tenant
 * @param {string} id.path.required - the tenant id - application/x-www-form-urlencoded
 */
tenant.get(
	'/:id',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTenantHandler(TenantService(db, redis, dayjs, badWord))),
);

export { tenant };
