/**
 * Log in a user and return the authentication cookie and CSRF token.
 *
 * @param {Object} app - The supertest app instance.
 * @param {string} url - The base URL for the application.
 * @param {string} userEmail - The email of the user to log in.
 * @param {string} [tenantSlug=null] - The tenant slug for setting the Host header. Defaults to null.
 * @returns {Object} - An object containing the login cookie and CSRF token.
 * @throws {Error} - Throws an error if the login request fails.
 */
export const login = async (app, url, userEmail, tenantSlug = null) => {
	const request = app.post('/test/login').send({ email: userEmail });

	if (tenantSlug) {
		request.set('Host', `${tenantSlug}.${url}`);
	}

	const login = await request;

	if (login.status !== 200) {
		throw new Error(`Login failed for user with email ${userEmail}`);
	}

	const cookie = login.headers['set-cookie'];

	const me = app.get('/test/me').set('Cookie', cookie);

	if (tenantSlug) {
		me.set('Host', `${tenantSlug}.${url}`);
	}

	const response = await me;

	return {
		cookie,
		csrfToken: response.body.csrfToken,
	};
};
