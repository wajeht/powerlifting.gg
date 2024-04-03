import express from 'express';

import { catchAsyncErrorHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';
import { SearchService } from './search.service.js';
import { getSearchHandler } from './search.handler.js';

const search = express.Router();

search.get('/', catchAsyncErrorHandler(getSearchHandler(SearchService(db))));

export { search };
