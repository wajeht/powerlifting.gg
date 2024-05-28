import axios from 'axios';
import qs from 'qs';
import { logger } from '../../../utils/logger.js';

export function getGoogleOAuthURL() {
	const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

	const options = {
		redirect_uri: process.env.GOOGLE_REDIRECT_URL,
		client_id: process.env.GOOGLE_ID,
		access_type: 'offline',
		response_type: 'code',
		prompt: 'consent',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		].join(' '),
	};

	const qs = new URLSearchParams(options);

	return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleOauthToken({ code }) {
	const rootURl = 'https://oauth2.googleapis.com/token';

	const options = {
		code,
		client_id: process.env.GOOGLE_ID,
		client_secret: process.env.GOOGLE_SECRET,
		redirect_uri: process.env.GOOGLE_REDIRECT_URL,
		grant_type: 'authorization_code',
	};

	try {
		const { data } = await axios.post(rootURl, qs.stringify(options), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		return data;
	} catch (error) {
		logger.alert('Failed to fetch Google Oauth Tokens', error);
		throw error;
	}
}

export async function getGoogleUser({ id_token, access_token }) {
	try {
		const { data } = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${id_token}`,
				},
			},
		);

		return data;
	} catch (error) {
		logger.alert('Failed to fetch Google User info', error);
		throw error;
	}
}
