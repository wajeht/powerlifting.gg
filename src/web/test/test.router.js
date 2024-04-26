import express from 'express';
import { body } from 'express-validator';
import {
	authenticationHandler,
	catchAsyncErrorHandler,
	csrfHandler,
	validateRequestHandler,
} from '../../app.middleware.js';
import { db } from '../../database/db.js';
import { NotFoundError } from '../../app.error.js';
import { app as appConfig } from '../../config/app.js';

const test = express.Router();

test.get(
	'/test/me',
	authenticationHandler,
	csrfHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (appConfig.env !== 'testing') {
			throw new NotFoundError('Operation not allowed in the current environment.');
		}
		return res.status(200).json({
			message: 'me!',
			csrfToken: req.csrfToken(),
		});
	}),
);

test.post(
	'/test/login',
	validateRequestHandler([
		body('email')
			.notEmpty()
			.withMessage('The email must not be empty!')
			.isEmail()
			.withMessage('The email must be email!'),
	]),
	catchAsyncErrorHandler(async (req, res) => {
		if (appConfig.env !== 'testing') {
			throw new NotFoundError('Operation not allowed in the current environment.');
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

		return res.status(200).json({
			message: 'logged in!',
		});
	}),
);

export { test };
