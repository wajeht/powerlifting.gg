import express from 'express';
import { db } from '../database/db.js';
import { env } from '../conifg/env.js';
import { tenantHandler } from '../app.middlewares.js';

const routes = express.Router();

routes.get('/', async (req, res, next) => {
	try {
		const domain = env.env === 'production' ? 'subdomain.jaw.dev' : `localhost:${env.port}`;
		let tenants = await db.select('*').from('tenants');
		tenants = tenants.map((tenant) => ({
			...tenant,
			domain: `http://${tenant.slug}.${domain}`,
		}));
		return res.status(200).render('home.html', { tenants });
	} catch (error) {
		next(error);
	}
});

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/login', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('login.html');
	} catch (error) {
		next(error);
	}
});

routes.post('/login', tenantHandler, async (req, res, next) => {
	try {
		// login
	} catch (error) {
		next(error);
	}
});

routes.get('/regiser', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('register.html');
	} catch (error) {
		next(error);
	}
});

routes.post('/regiser', tenantHandler, async (req, res, next) => {
	try {
		// regiser
	} catch (error) {
		next(error);
	}
});

export default routes;
