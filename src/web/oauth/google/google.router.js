import express from 'express';
import { tenantIdentityHandler } from '../../../app.middleware.js';
import { getGoogleHandler, getGoogleRedirectHandler } from './google.handler.js';

const google = express.Router();

/**
 * GET /oauth/google
 * @tags oauth
 * @summary get google oauth url
 */
google.get('/', getGoogleHandler());

/**
 * GET /oauth/google/redirect
 * @tags oauth
 * @summary get google oauth redirect url
 */
google.get('/redirect', tenantIdentityHandler, getGoogleRedirectHandler());

export { google };
