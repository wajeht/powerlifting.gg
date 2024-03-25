import express from 'express';

import { tenantHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { userService } from './user.service.js';
import { getTenantUsersHandler } from './user.handler.js';

const user = express.Router();

user.get('/', tenantHandler, getTenantUsersHandler(userService(db)));

export { user };
