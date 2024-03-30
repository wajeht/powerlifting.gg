import express from 'express';
import { user as userRouter } from './user/user.router.js';
import { tenant as tenantRouter } from './tenant/tenant.router.js';

const api = express.Router();

api.use('/api/users', userRouter);
api.use('/api/tenants', tenantRouter);

export { api };
