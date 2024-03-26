import express from 'express';
import { db } from '../database/db.js';
import { tenantHandler } from '../app.middlewares.js';
import { NotFoundError, UnimplementedFunctionError } from '../app.errors.js';
import bcrypt from 'bcryptjs';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/privacy-policy', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) {
			return res.status(200).render('privacy-policy.html');
		}

		return res.status(200).render('privacy-policy.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.get('/terms-of-services', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) {
			return res.status(200).render('terms-of-services.html');
		}

		return res.status(200).render('terms-of-services.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.get('/', tenantHandler, async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
});

routes.get('/admin', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('admin.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.get('/user/:username', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

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
	} catch (error) {
		next(error);
	}
});

routes.post('/user/:id', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.method === 'DELETE') {
			const user = await db
				.delete()
				.from('users')
				.where({ tenant_id: req.tenant.id, id: req.params.id });

			if (!user) throw new NotFoundError();

			return res.redirect('/admin');
		}

		throw new UnimplementedFunctionError();
	} catch (error) {
		next(error);
	}
});

routes.get('/login', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('login.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/login', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

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
	} catch (error) {
		next(error);
	}
});

routes.get('/register', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('register.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/register', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.message === '' || req.body.email === '') {
			req.flash('error', 'username or password cannot be empty!');
			return res.redirect('/register');
		}

		const user = await db.select('*').from('users').where({ email: req.body.email }).first();

		if (user) {
			req.flash('error', 'username already exist!');
			return res.redirect('/register');
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		await db('users').insert({
			tenant_id: req.tenant.id,
			email: req.body.email,
			password: hashedPassword,
		});

		return res.redirect('/admin');
	} catch (error) {
		next(error);
	}
});

export default routes;
