import express from 'express';
import { db } from '../database/db.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	tenancyHandler,
	// validateRequestHandler,
} from '../app.middlewares.js';
import { NotFoundError, UnimplementedFunctionError } from '../app.errors.js';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../emails/email.js';
import {
	getAdminHandler,
	getHealthzHandler,
	getLoginHandler,
	getPrivacyPolicyHandler,
	getRegiserHanlder,
	getTermsOfServiceHandler,
	getUser,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { WebService } from './web.service.js';
// import { body } from 'express-validator';

const web = express.Router();

web.get('/healthz', getHealthzHandler());

web.get(
	'/privacy-policy',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getPrivacyPolicyHandler()),
);

web.get(
	'/terms-of-services',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTermsOfServiceHandler()),
);

web.get(
	'/register',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(getRegiserHanlder()),
);

web.post(
	'/user/:id',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(
		getUser(WebService(WebRepository(db), NotFoundError, UnimplementedFunctionError)),
	),
);

web.get('/admin', tenantIdentityHandler, tenancyHandler, catchAsyncErrorHandler(getAdminHandler()));

web.get('/login', tenantIdentityHandler, tenancyHandler, catchAsyncErrorHandler(getLoginHandler()));

web.get(
	'/',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (req.tenant) {
			const users = await db.select('*').from('users').where({ tenant_id: req.tenant.id });
			return res.status(200).render('tenant.html', {
				tenant: JSON.stringify(req.tenant),
				layout: '../layouts/tenant.html',
				users,
			});
		}

		const tenants = await db.select('*').from('tenants');
		return res.status(200).render('home.html', { tenants });
	}),
);

web.get(
	'/user/:username',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(async (req, res) => {
		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, username: req.params.username })
			.first();

		if (!user) throw new NotFoundError();

		return res.status(200).render('user.html', {
			user,
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

web.post(
	'/login',
	tenantIdentityHandler,
	tenancyHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (req.body.message === '' || req.body.email === '') {
			req.flash('error', 'username or password cannot be empty!');
			return res.redirect('/login');
		}

		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, email: req.body.email })
			.first();

		if (!user) {
			req.flash('error', 'email or password is wrong!');
			return res.redirect('/login');
		}

		const comparedPassword = await bcrypt.compare(req.body.password, user.password);

		if (!comparedPassword) {
			req.flash('error', 'email or password is wrong!');
			return res.redirect('/login');
		}

		return res.redirect('/admin');
	}),
);

web.post(
	'/register',
	tenantIdentityHandler,
	tenancyHandler,
	// validateRequestHandler([
	// 	body('username')
	// 		.notEmpty()
	// 		.withMessage('email must not be empty')
	// 		.trim()
	// 		.isEmail()
	// 		.withMessage('must be email'),
	// ]),
	catchAsyncErrorHandler(async (req, res) => {
		if (req.body.message === '' || req.body.email === '' || req.body.username === '') {
			req.flash('error', 'username or password cannot be empty!');
			return res.redirect('/register');
		}

		const user = await db.select('*').from('users').where({ email: req.body.email }).first();

		if (user) {
			req.flash('error', 'user already exist!');
			return res.redirect('/register');
		}

		if (user && user.username === req.body.username) {
			req.flash('error', 'username already exist!');
			return res.redirect('/register');
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		await db('users').insert({
			tenant_id: req.tenant.id,
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});

		// TODO: use job queue
		await sendWelcomeEmail({ email: req.body.email, username: req.body.username });

		return res.redirect('/admin');
	}),
);

export { web };
