import express from 'express';
import { catchAsyncErrorHandler, tenantIdentityHandler } from '../../../app.middleware.js';
import { getGoogleHandler, getGoogleRedirectHandler } from './google.handler.js';

const google = express.Router();

/**
 * GET /oauth/google
 * @tags oauth
 * @summary get google oauth url
 */
google.get('/', catchAsyncErrorHandler(getGoogleHandler()));

/**
 * GET /oauth/google/redirect
 * @tags oauth
 * @summary get google oauth redirect url
 */
google.get('/redirect', tenantIdentityHandler, catchAsyncErrorHandler(getGoogleRedirectHandler()));

export { google };
