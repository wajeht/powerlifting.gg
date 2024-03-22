import express from 'express';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/', (req, res) => {
	return res.status(200).render('./home.html');
});

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
