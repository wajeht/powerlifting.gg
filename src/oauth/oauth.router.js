import express from 'express';
import { google as googleRouter } from './google/google.router.js';

const oauth = express.Router();

oauth.use('/oauth/google', googleRouter);

export { oauth };
