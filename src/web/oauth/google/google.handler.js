import { job } from '../../../job/job.js';
import { db } from '../../../database/db.js';
import { UnauthorizedError } from '../../../app.error.js';
import { app as appConfig } from '../../../config/app.js';
import { getGoogleOAuthURL, getGoogleOauthToken, getGoogleUser } from './google.util.js';

export function getGoogleHandler() {
	return (req, res) => {
		if (req.session.user) {
			return res.redirect('back');
		}
		return res.redirect(getGoogleOAuthURL());
	};
}

export function getGoogleRedirectHandler() {
	return async (req, res) => {
		const code = req.query.code;

		if (!code) {
			throw new UnauthorizedError('Authentication failed: No authorization code provided');
		}

		const { id_token, access_token } = await getGoogleOauthToken({ code });

		const googleUser = await getGoogleUser({ id_token, access_token });

		if (!googleUser || !googleUser.verified_email) {
			throw new UnauthorizedError('Authentication failed: Unable to verify email with Google');
		}

		let foundUser = await db.select('*').from('users').where({ email: googleUser.email }).first();

		if (!foundUser) {
			const username = googleUser.email.split('@')[0];
			const role = appConfig.super_admin_email === googleUser.email ? 'SUPER_ADMIN' : 'USER';

			foundUser = await db('users')
				.insert({
					role,
					username,
					email: googleUser.email,
					profile_picture: googleUser.picture,
				})
				.returning('*');

			foundUser = foundUser[0];

			await job.sendWelcomeEmailJob({ email: googleUser.email, username });
		}

		req.session.user = foundUser;
		req.session.save();

		if (req.session.redirectUrl) {
			const redirectUrl = req.session.redirectUrl;
			delete req.session.redirectUrl;
			return res.redirect(`${redirectUrl}/?alert-success=Welcome back, ${foundUser.username}!`);
		}

		return res.redirect(`/?alert-success=Welcome ${foundUser.username}!`);
	};
}
