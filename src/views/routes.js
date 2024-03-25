import express from 'express';
import { db } from '../database/db.js';
import { tenantHandler } from '../app.middlewares.js';
import { NotFoundError, UnimplementedFunctionError, ValidationError } from '../app.errors.js';
import bcrypt from 'bcryptjs';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
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

		const users = await db.select('*').from('users').where({ tenant_id: req.tenant.id });
		return res.status(200).render('admin.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			users: JSON.stringify(users),
		});
	} catch (error) {
		next(error);
	}
});

routes.get('/user/:id', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, id: req.params.id })
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
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/login', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.message === '' || req.body.email === '') {
			throw new ValidationError('username or password cannot be empty!');
		}

		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, email: req.body.email })
			.first();

		if (!user) throw new ValidationError('email or password is wrong!');

		const comparedPassword = await bcrypt.compare(req.body.password, user.password);

		if (!comparedPassword) throw new ValidationError('email or password is wrong!');

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
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/register', tenantHandler, async (req, res, next) => {
	try {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.message === '' || req.body.email === '') {
			throw new ValidationError('username or password cannot be empty!');
		}

		const user = await db.select('*').from('users').where({ email: req.body.email }).first();

		if (user) {
			throw new ValidationError('user already exists!');
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
