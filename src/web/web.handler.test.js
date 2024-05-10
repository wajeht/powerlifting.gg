import { describe, expect, it, vi } from 'vitest';
import { getHealthzHandler, getTenantsHandler, getTenantsCreateHandler } from './web.handler.js';

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

describe('getTenantsHandler', () => {
	it('should return tenants HTML page with appropriate data', async () => {
		const TenantService = {
			getApprovedTenantSearch: vi.fn().mockResolvedValue([
				{ id: 1, name: 'Tenant 1' },
				{ id: 2, name: 'Tenant 2' },
			]),
		};

		const req = {
			query: {
				q: 'search query',
				per_page: '10',
				current_page: '2',
				sort: 'desc',
			},
		};

		const res = {
			status: vi.fn(() => res),
			render: vi.fn(),
		};

		const handler = getTenantsHandler(TenantService);
		await handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.render).toHaveBeenCalledWith('tenants.html', {
			tenants: [
				{ id: 1, name: 'Tenant 1' },
				{ id: 2, name: 'Tenant 2' },
			],
			q: 'search query',
			title: 'Tenants',
			path: '/tenants',
		});
	});
});

describe('getTenantsCreateHandler', () => {
	it('should return tenants create HTML page with appropriate data', async () => {
		const req = { flash: vi.fn().mockReturnValue({ success: 'Tenant created successfully' }) };

		const res = {
			status: vi.fn(() => res),
			render: vi.fn(),
		};

		const handler = getTenantsCreateHandler();
		await handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.render).toHaveBeenCalledWith('tenants-create.html', {
			flashMessages: { success: 'Tenant created successfully' },
			title: 'Tenants / Create',
			path: '/tenants/create',
		});
	});
});
