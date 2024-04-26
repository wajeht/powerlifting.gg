import express from 'express';
import { body } from 'express-validator';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	validateRequestHandler,
} from '../../app.middleware.js';
import { db } from '../../database/db.js';
import { NotFoundError } from '../../app.error.js';
import { app as appConfig } from '../../config/app.js';

const test = express.Router();

test.post(
	'/test/login',
	tenantIdentityHandler,
	validateRequestHandler(
		body('email')
			.notEmpty()
			.withMessage('The email must not be empty!')
			.trim()
			.isEmail()
			.withMessage('The email must be email!'),
	),
	catchAsyncErrorHandler(async (req, res) => {
		if (!['testings'].includes(appConfig.env)) {
			throw new NotFoundError('Operation not allowed in the current environment.');
		}

		if (req.tenant) {
			throw new NotFoundError();
		}

		const email = req.body.email;

		if (!email) {
			return res.status(400).send('Email is required');
		}

		let foundUser = await db.select('*').from('users').where({ email }).first();

		if (!foundUser) {
			const username = email.split('@')[0];
			foundUser = await db('users')
				.insert({
					username,
					email,
				})
				.returning('*');

			foundUser = foundUser[0];
		}

		req.session.user = foundUser;
		await req.session.save();

		if (req.session.redirectUrl) {
			const redirectUrl = req.session.redirectUrl;
			delete req.session.redirectUrl;
			return res.redirect(redirectUrl);
		}

		return res.redirect('/');
	}),
);

export { test };
