import { body } from 'express-validator';
import { db } from '../database/db.js';
import { ValidationError } from '../app.error.js';

export const postTenantHandlerValidation = [
	body('name')
		.notEmpty()
		.withMessage('The name must not be empty!')
		.trim()
		.isLength({ min: 1, max: 30 })
		.withMessage('The name must be at least 1 character long or less than 30 character long'),
	body('slug')
		.notEmpty()
		.withMessage('The slug must not be empty!')
		.trim()
		.isLength({ min: 1, max: 30 })
		.withMessage('The slug must be at least 1 character long or less than 30 character long')
		.custom(async (slug) => {
			const tenant = await db.select('*').from('tenants').where({ slug }).first();
			if (tenant) {
				throw new ValidationError('The slug already exist!');
			}
			return true;
		}),
];
