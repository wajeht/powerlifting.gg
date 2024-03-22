import express from 'express';
import { db } from '../database/db.js';
import { env } from '../conifg/env.js';
import { logger } from '../utils/logger.js'

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/', tenant, async (req, res) => {
	logger.debug(req.subdomains, req.hostname);
	let tenants = await db.select('*').from('tenants');
		tenants = tenants.map((tenant) => ({
		...tenant,
		domain: `http://${tenant.slug}.localhost:${env.port}`
	}));
	return res.status(200).render('./home.html', { tenants });
});

export function tenant(req, res, next) {
	const subdomain = req.hostname.split('.')[0];
	req.subdomain = subdomain;
	next();
}

export function notFoundHandler(req, res, next) {
	return res.status(404).render('./not-found.html');
}

export function errorHandler(error, req, res, next) {
	return res.status(500).render('./error.html');
}

export function rateLimitHandler(req, res, next) {
	if (req.get('Content-Type') === 'application/json') {
		return res.json({ message: 'Too many requests, please try again later.' });
	}
	return res.status(429).render('./rate-limit.html');
}

export default routes;
