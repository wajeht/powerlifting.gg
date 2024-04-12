import express from 'express';
import { getGoogleOAuthURL, getGoogleOauthToken, getGoogleUser } from './google.util.js';
import { UnauthorizedError } from '../../app.errors.js';
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
google.get('/redirect', async (req, res) => {
	const code = req.query.code;

	if (!code) {
		// if no code is provided
		throw new UnauthorizedError('Something went wrong while authenticating with Google');
	}

	const { id_token, access_token } = await getGoogleOauthToken({ code });

	const googleUser = await getGoogleUser({
		id_token,
		access_token,
	});

	console.log(googleUser);

	if (!googleUser.verified_email) {
		// if email is not verified
		throw new UnauthorizedError('Something went wrong while authenticating with Google');
	}

	const found = await db.select('*').from('users').where({ email: googleUser.email });

	// await sendWelcomeEmail({ email: req.body.email, username: req.body.username });

	if (!found) {
		// const createdUser = await User.create({
		//   email: googleUser.email,
		//   name: googleUser.name,
		//   verification_token: access_token,
		//   verified: true,
		//   verified_at: new Date(),
		// });

		// sendWelcomeEmail({
		//   name: createdUser.name,
		//   email: createdUser.email,
		//   userId: createdUser.id,
		// });

		req.flash('success', 'We will send you an API key to your email very shortly!');

		return res.redirect('/register');
	}

	req.flash(
		'error',
		"Email already exist, please click on 'Forgot api key?' to request a new one!",
	);

	return res.redirect('/register');
});

export { google };
