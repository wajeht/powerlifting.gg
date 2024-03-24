import express from 'express';

const api = express.Router();

api.get('/healthz', (req, res, next) => {
	try {
		return res.status(200).json({ message: 'ok', date: new Date() });
	} catch (error) {
		next(error);
	}
});

export default api;
