import express from 'express';
import { sendWelcomeEmail } from '../../emails/email.js';
import { getGoogleOAuthURL, getGoogleOauthToken, getGoogleUser } from './google.util.js';
import { UnauthorizedError } from '../../app.errors.js';
import { tenantIdentityHandler } from '../../app.middlewares.js';
import { db } from '../../database/db.js';

const google = express.Router();

/**
 * GET /oauth/google
 * @tags oauth/google
 * @summary get healthz page
 */
google.get('/', (req, res) => {
	return res.redirect(getGoogleOAuthURL());
});

/**
 * GET /oauth/google/redirect
 * @tags oauth/google
 * @summary get healthz page
 */
google.get('/redirect', tenantIdentityHandler, async (req, res) => {
	const code = req.query.code;

	if (!code) {
		throw new UnauthorizedError('Something went wrong while authenticating with Google');
	}

	const { id_token, access_token } = await getGoogleOauthToken({ code });

	const googleUser = await getGoogleUser({
		id_token,
		access_token,
	});

	if (!googleUser.verified_email) {
		throw new UnauthorizedError('Something went wrong while authenticating with Google');
	}

	const found = await db.select('*').from('users').where({ email: googleUser.email }).first();

	if (!found) {
		const username = googleUser.email.split('@')[0];
		await db('users').insert({
			username: googleUser.email.split('@')[0],
			email: googleUser.email,
			profile_picture: googleUser.picture,
		});

		await sendWelcomeEmail({ email: googleUser.verified_email, username });
	}

	// Todo: redirect back to where they came from

	return res.redirect('/register');
});

export { google };
