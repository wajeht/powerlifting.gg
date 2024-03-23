import { it, describe, expect } from 'vitest';
import {
	ForbiddenError,
	UnauthorizedError,
	NotFoundError,
	ValidationError,
	UnimplementedFunctionError,
} from './app.errors.js';

describe('ForbiddenError', () => {
	it('should return an error with status code 403 and default message', () => {
		const error = ForbiddenError();
		expect(error.statusCode).toBe(403);
		expect(error.message).toBe('Forbidden');
	});

	it('should return an error with status code 403 and custom message', () => {
		const errorMessage = 'Custom Forbidden Message';
		const error = ForbiddenError(errorMessage);
		expect(error.statusCode).toBe(403);
		expect(error.message).toBe(errorMessage);
	});
});

describe('UnauthorizedError', () => {
	it('should return an error with status code 401 and default message', () => {
		const error = UnauthorizedError();
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe('Unauthorized');
	});

	it('should return an error with status code 401 and custom message', () => {
		const errorMessage = 'Custom Unauthorized Message';
		const error = UnauthorizedError(errorMessage);
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe(errorMessage);
	});
});

describe('NotFoundError', () => {
	it('should return an error with status code 404 and default message', () => {
		const error = NotFoundError();
		expect(error.statusCode).toBe(404);
		expect(error.message).toBe('Not Found');
	});

	it('should return an error with status code 404 and custom message', () => {
		const errorMessage = 'Custom Not Found Message';
		const error = NotFoundError(errorMessage);
		expect(error.statusCode).toBe(404);
		expect(error.message).toBe(errorMessage);
	});
});

describe('ValidationError', () => {
	it('should return an error with status code 422 and default message', () => {
		const error = ValidationError();
		expect(error.statusCode).toBe(422);
		expect(error.message).toBe('Validation Error');
	});

	it('should return an error with status code 422 and custom message', () => {
		const errorMessage = 'Custom Validation Error Message';
		const error = ValidationError(errorMessage);
		expect(error.statusCode).toBe(422);
		expect(error.message).toBe(errorMessage);
	});
});

describe('UnimplementedFunctionError', () => {
	it('should return an error with status code 501 and default message', () => {
		const error = UnimplementedFunctionError();
		expect(error.statusCode).toBe(501);
		expect(error.message).toBe('Function Not Implemented');
	});

	it('should return an error with status code 501 and custom message', () => {
		const errorMessage = 'Custom Unimplemented Message';
		const error = UnimplementedFunctionError(errorMessage);
		expect(error.statusCode).toBe(501);
		expect(error.message).toBe(errorMessage);
	});
});
