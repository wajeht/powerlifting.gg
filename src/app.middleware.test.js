import { it, expect, vi, describe } from 'vitest';
import { errorHandler } from './app.middleware.js';
import {
	ForbiddenError,
	UnauthorizedError,
	NotFoundError,
	ValidationError,
	UnimplementedFunctionError,
	HttpError,
} from './app.error.js';

describe.concurrent('errorHandler', () => {
	const mockReq = {};
	const mockRes = {
		status: vi.fn(() => mockRes),
		render: vi.fn(),
	};

	it('should handle error in production environment', () => {
		const mockError = new HttpError();
		process.env.NODE_ENV = 'production';

		errorHandler(mockError, mockReq, mockRes);

		expect(mockRes.status).toHaveBeenCalledWith(500);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Oops! Something went wrong.',
			statusCode: 500,
			title: '/undefined',
		});
	});

	it('should handle error in non-production environment without tenant', () => {
		const mockError = new HttpError();

		errorHandler(mockError, mockReq, mockRes);

		expect(mockRes.status).toHaveBeenCalledWith(500);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Oops! Something went wrong.',
			statusCode: 500,
			title: '/undefined',
		});
	});

	it.skip('should handle error in non-production environment with tenant', () => {
		const mockError = new HttpError();
		mockReq.tenant = { name: 'Test Tenant' };

		errorHandler(mockError, mockReq, mockRes);

		expect(mockRes.status).toHaveBeenCalledWith(500);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			tenant: JSON.stringify(mockReq.tenant),
			layout: '../layouts/tenant.html',
			error: expect.anything(),
			title: '/undefined',
		});
	});

	it('should handle NotFoundError', () => {
		process.env.NODE_ENV = 'production';
		const mockError = new NotFoundError('Not Found');
		errorHandler(mockError, mockReq, mockRes);
		expect(mockRes.status).toHaveBeenCalledWith(404);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Oops! The page you are looking for cannot be found.',
			statusCode: 404,
			title: '/undefined',
		});
	});

	it('should handle ForbiddenError', () => {
		process.env.NODE_ENV = 'production';
		const mockError = new ForbiddenError('Forbidden');
		errorHandler(mockError, mockReq, mockRes);
		expect(mockRes.status).toHaveBeenCalledWith(403);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Forbidden',
			statusCode: 403,
			title: '/undefined',
		});
	});

	it('should handle UnauthorizedError', () => {
		process.env.NODE_ENV = 'production';
		const mockError = new UnauthorizedError('Unauthorized');
		errorHandler(mockError, mockReq, mockRes);
		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Unauthorized',
			statusCode: 401,
			title: '/undefined',
		});
	});

	it('should handle ValidationError', () => {
		const mockError = new ValidationError('Validation Error');
		errorHandler(mockError, mockReq, mockRes);
		expect(mockRes.status).toHaveBeenCalledWith(422);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Validation Error',
			statusCode: 422,
			title: '/undefined',
		});
	});

	it('should handle UnimplementedFunctionError', () => {
		process.env.NODE_ENV = 'production';
		const mockError = new UnimplementedFunctionError('Unimplemented Function');
		errorHandler(mockError, mockReq, mockRes);
		expect(mockRes.status).toHaveBeenCalledWith(501);
		expect(mockRes.render).toHaveBeenCalledWith('error.html', {
			error: 'Unimplemented Function',
			statusCode: 501,
			title: '/undefined',
		});
	});
});
