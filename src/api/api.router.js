import express from 'express';
import { tenant as tenantRouter } from './tenant/tenant.router.js';
import { reviews as reviewRouter } from './review/review.router.js';
import { admin as adminRouter } from './admin/admin.router.js';

const api = express.Router();

api.use('/api/admin', adminRouter);
api.use('/api/reviews', reviewRouter);
api.use('/api/tenants', tenantRouter);

export { api };
