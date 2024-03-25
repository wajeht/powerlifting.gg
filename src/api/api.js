import express from 'express';
import { user as userRouter } from './users/user.router.js';

const api = express.Router();

api.get('/healthz', (req, res, next) => {
	try {
		return res.status(200).json({ message: 'ok', date: new Date() });
	} catch (error) {
		next(error);
	}
});

api.use('/users', userRouter);

export default api;
