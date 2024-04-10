import express from 'express';
import { user as userRouter } from './user/user.router.js';
import { cache as cacheRouter } from './cache/cache.router.js';
import { tenant as tenantRouter } from './tenant/tenant.router.js';
import { search as searchRouter } from './search/search.router.js';

const api = express.Router();

api.use('/api/cache', cacheRouter);
api.use('/api/users', userRouter);
api.use('/api/tenants', tenantRouter);
api.use('/api/search', searchRouter);

export { api };
