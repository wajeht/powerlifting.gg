import { db } from '../database/db.js';
import { ValidationError } from '../app.error.js';
import { body, param, query } from 'express-validator';

export const postCalibrateTenantRatingsValidation = [
	body('id')
		.notEmpty()
		.withMessage('The id must not be empty!')
		.custom(async (id, { req }) => {
			if (Array.isArray(id) && req?.session?.user?.role !== 'SUPER_ADMIN') {
				throw new Error('Only admins can send an array of IDs!');
			}

			const ids = id.map((i) => parseInt(i));
			const tenants = await db
				.select('*')
				.from('tenants')
				.whereIn('id', ids)
				.andWhere({ approved: true });

			if (!tenants.length) {
				throw new ValidationError('One or more tenants do not exist!');
			}

			if (req?.session?.user?.role === 'SUPER_ADMIN') return true;

			for (const tenant of tenants) {
				if (tenant.ratings_calibration_count > 1) {
					throw new Error(`Exceeded calibration for tenant with ID ${tenant.id}!`);
				}
			}

			return true;
		}),
];

export const postSettingsTenantsDangerZoneHandlerValidation = [
	param('id')
		.notEmpty()
		.withMessage('The id must not be empty!')
		.custom(async (id) => {
			const tenant_id = parseInt(id);
			const tenant_ids = (await db.select('tenant_id').from('coaches').where({ tenant_id })).map(
				(c) => parseInt(c.tenant_id),
			);
			if (!tenant_ids.includes(tenant_id)) {
				throw new ValidationError('must be your own tenant');
			}
			return true;
		}),
];

export const postSettingsTenantsDetailsValidation = [
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
		.custom(async (slug, { req }) => {
			const tenantId = req.params.id;
			const tenant = await db('tenants').where('slug', slug).andWhereNot('id', tenantId).first();
			if (tenant) {
				throw new ValidationError('The slug already exists!');
			}
			return true;
		}),
	body('social')
		.optional()
		.custom((social) => {
			if (social.trim().length === 0) return true;
			const regex = /^((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(, ?)?)+$/;
			if (!regex.test(social)) {
				throw new Error('The social field contains invalid URLs.');
			}
			return true;
		}),
];

export const getUnsubscribeHandlerValidation = [
	query('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be valid!'),
];

export const postExportTenantReviewsHandlerValidation = [
	body('id')
		.notEmpty()
		.withMessage('The id must not be empty!')
		.custom(async (id, { req }) => {
			if (!Array.isArray(id)) {
				throw new ValidationError('ID must be an array.');
			}

			const tenantIds = id.map((i) => parseInt(i));
			const userTenantIds = await db('coaches')
				.where({ user_id: req?.session?.user.id })
				.pluck('tenant_id')
				.then((ids) => ids.map((tid) => parseInt(tid)));

			const hasValidTenants = tenantIds.every((tid) => userTenantIds.includes(tid));

			if (!hasValidTenants) {
				throw new ValidationError('Must only request your tenant');
			}

			const reviewsCount = await db('reviews')
				.whereIn('tenant_id', tenantIds)
				.count({ count: '*' })
				.first();

			if (reviewsCount.count === 0) {
				throw new ValidationError('No reviews exist currently');
			}

			return true;
		}),
];

export const postSubscriptionsHandlerValidation = [
	body('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be valid!')
		.custom(async (email, { req }) => {
			const sessionUser = req?.session?.user;
			const user = await db.select('*').from('subscriptions').where({ email }).first();
			if (user && sessionUser && user.email !== sessionUser.email) {
				throw new ValidationError('The email already exists!');
			}
			return true;
		}),
];

export const postNewsletterHandlerValidation = [
	body('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be valid!')
		.custom(async (email) => {
			const user = await db
				.select('*')
				.from('subscriptions')
				.where({ email })
				.andWhere('type', 'like', '%"newsletter":true%')
				.first();
			if (user) {
				throw new ValidationError('The email already exists!');
			}
			return true;
		}),
];

export const postSettingsAccountHandlerValidation = [
	body('username')
		.notEmpty()
		.withMessage('The username must not be empty!')
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage('The username must be at least 1 character long or less than 100 characters long')
		.custom(async (username, { req }) => {
			const userId = req.session.user.id;
			const user = await db.select('*').from('users').where({ username }).first();
			if (user && user.id !== userId) {
				throw new ValidationError('The username already exists!');
			}
			return true;
		}),
	body('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be valid!')
		.custom(async (email, { req }) => {
			const userId = req.session.user.id;
			const user = await db.select('*').from('users').where({ email }).first();
			if (user && user.id !== userId) {
				throw new ValidationError('The email already exists!');
			}
			return true;
		}),
];

export const getBlogPostHandlerValidation = [
	param('id')
		.notEmpty()
		.withMessage('The id must not be empty!')
		.custom(async (id) => {
			const dashCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
			if (!dashCasePattern.test(id)) {
				throw new ValidationError('must be in dash case!');
			}
			return true;
		}),
];

export const postSubscribeToATenantValidation = [
	param('id')
		.notEmpty()
		.withMessage('The id must not be empty!')
		.custom(async (id) => {
			const tenant = await db.select('*').from('tenants').where({ id, approved: true }).first();
			if (!tenant) {
				throw new ValidationError('The tenant does not exist!');
			}
			return true;
		}),
];

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
	body('verified')
		.optional()
		.trim()
		.custom((verified) => {
			if (verified !== 'on') {
				throw new Error('Must claim this tenant!');
			}
			return true;
		}),
	body('agree')
		.notEmpty()
		.withMessage('Must agree to our terms of services!')
		.trim()
		.custom((checkbox) => {
			if (checkbox !== 'on') {
				throw new Error('Must agree to our terms of services!');
			}
			return true;
		}),
	body('social')
		.optional()
		.custom((social) => {
			if (social.trim().length === 0) return true;
			const regex = /^((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(, ?)?)+$/;
			if (!regex.test(social)) {
				throw new Error('The social field contains invalid URLs.');
			}
			return true;
		}),
];

export const postContactHandlerValidation = [
	body('message')
		.notEmpty()
		.withMessage('The message must not be empty!')
		.trim()
		.isLength({ min: 1, max: 500 })
		.withMessage('The message must be at least 1 character long or less than 500 character long'),
	body('email')
		.notEmpty()
		.withMessage('The email must not be empty!')
		.trim()
		.isEmail()
		.withMessage('The email must be email!'),
	body('subject')
		.notEmpty()
		.withMessage('The subject must not be empty!')
		.isLength({ min: 1, max: 100 })
		.withMessage('The subject must be at least 1 character long or less than 100 character long'),
];

export const postReviewHandlerValidation = [
	body('comment')
		.notEmpty()
		.withMessage('The comment must not be empty!')
		.trim()
		.isLength({ min: 1, max: 500 })
		.withMessage('The comment must be at least 1 character long or less than 500 character long'),
	body('ratings').notEmpty().withMessage('The ratings must not be empty!'),
];
