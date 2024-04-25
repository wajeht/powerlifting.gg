import { body } from 'express-validator';
import { db } from '../database/db.js';
import { ValidationError } from '../app.error.js';

export const postTenantHandlerValidation = [
	body('name')
		.notEmpty()
		.withMessage('The name must not be empty!')
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage('The name must be at least 1 character long or less than 50 character long'),
	body('slug')
		.notEmpty()
		.withMessage('The slug must not be empty!')
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage('The slug must be at least 1 character long or less than 50 character long')
		.custom(async (slug) => {
			const tenant = await db.select('*').from('tenants').where({ slug }).first();
			if (tenant) {
				throw new ValidationError('The slug already exist!');
			}
			return true;
		}),
];

export const postContactHandlerValidation = [
	body('message')
		.notEmpty()
		.withMessage('The message must not be empty!')
		.trim()
		.isLength({ min: 1, max: 225 })
		.withMessage('The message must be at least 1 character long or less than 225 character long'),
	body('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be email!'),
];

export const postReviewHandlerValidation = [
	body('comment')
		.notEmpty()
		.withMessage('The comment must not be empty!')
		.trim()
		.isLength({ min: 1, max: 225 })
		.withMessage('The comment must be at least 1 character long or less than 225 character long'),
	body('ratings')
		.notEmpty()
		.withMessage('The ratings must not be empty!')
];
