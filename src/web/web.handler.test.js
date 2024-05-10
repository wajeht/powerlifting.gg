import { describe, expect, it, vi } from 'vitest';
import { getHealthzHandler } from './web.handler.js';

vi.mock('process', () => ({
	uptime: () => 100,
}));

describe('getHealthzHandler', () => {
	it('should return JSON response with uptime when Content-Type is application/json', () => {
		const req = { get: () => 'application/json' };
		const res = {
			status: vi.fn(() => res),
			json: vi.fn(),
		};

		const handler = getHealthzHandler();
		handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'ok', uptime: expect.anything() });
	});

	it('should return HTML response with uptime when Content-Type is not application/json', () => {
		const req = { get: () => 'text/html' };
		const res = {
			status: vi.fn(() => res),
			render: vi.fn(),
		};

		const handler = getHealthzHandler();
		handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.render).toHaveBeenCalledWith('healthz.html', {
			uptime: expect.anything(),
			title: 'Healthz',
			path: '/healthz',
			layout: '../layouts/healthz.html',
		});
	});
});
