import express from 'express';

import { tenantHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { TenantService } from './tenant.service.js';
import { getTenantHandler } from './tenant.handler.js';

const tenant = express.Router();

tenant.get('/:id', tenantHandler, getTenantHandler(TenantService(db)));

export { tenant };
