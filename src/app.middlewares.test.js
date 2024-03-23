import { it, expect, vi } from 'vitest';
import { errorHandler } from './app.middlewares.js';

const mockReq = {};
const mockRes = {
	status: vi.fn(() => mockRes),
	render: vi.fn(),
};

it('should handle error in production environment', () => {
	const mockError = 'Test error';
	const mockEnv = process.env.NODE_ENV;
	process.env.NODE_ENV = 'production';

	errorHandler(mockError, mockReq, mockRes);

	expect(mockRes.status).toHaveBeenCalledWith(500);
	expect(mockRes.render).toHaveBeenCalledWith('error.html', {
		error: 'oh no, something went wrong!',
	});

	process.env.NODE_ENV = mockEnv; // Restore original environment
});

it('should handle error in non-production environment without tenant', () => {
	const mockError = 'Test error';

	errorHandler(mockError, mockReq, mockRes);

	expect(mockRes.status).toHaveBeenCalledWith(500);
	expect(mockRes.render).toHaveBeenCalledWith('error.html', {
		error: mockError,
	});
});

it('should handle error in non-production environment with tenant', () => {
	const mockError = 'Test error';
	mockReq.tenant = { name: 'Test Tenant' };

	errorHandler(mockError, mockReq, mockRes);

	expect(mockRes.status).toHaveBeenCalledWith(500);
	expect(mockRes.render).toHaveBeenCalledWith('./error.html', {
		tenant: JSON.stringify(mockReq.tenant),
		layout: '../layouts/tenant.html',
		error: mockError,
	});
});
