import { it, expect, vi, describe } from 'vitest';
import { logger } from './logger.js';

const consoleMock = {
	debug: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
};

globalThis.console = consoleMock;

describe.skip.concurrent('logger', () => {
	it('should be able to log debug', () => {
		logger.debug('Debug message');
		expect(consoleMock.debug).toHaveBeenCalled();
		expect(consoleMock.debug.mock.calls[0][1]).toBe('Debug message');
	});

	it('should be able to log error', () => {
		logger.error('Error message');
		expect(consoleMock.error).toHaveBeenCalled();
		expect(consoleMock.error.mock.calls[0][1]).toBe('Error message');
	});

	it('should be able to log info', () => {
		logger.info('Info message');
		expect(consoleMock.info).toHaveBeenCalled();
		expect(consoleMock.info.mock.calls[0][1]).toBe('Info message');
	});
});
