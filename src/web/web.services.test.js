import { describe, expect, it, vi } from 'vitest';
import { WebService } from './web.service.js';

describe('WebService', () => {
	const WebRepository = {
		deleteUser: vi.fn().mockResolvedValue(),
		updateUser: vi.fn().mockResolvedValue(),
		getUser: vi.fn().mockResolvedValue(),
	};

	const redis = {
		keys: vi.fn().mockResolvedValue(['key1', 'key2']),
		del: vi.fn().mockResolvedValue(),
	};

	const job = {};

	const webService = WebService(WebRepository, redis, job);

	describe('clearSystemWideCache', () => {
		it('should clear system-wide cache', async () => {
			await webService.clearSystemWideCache();

			expect(redis.keys).toHaveBeenCalledWith('*');
			expect(redis.del).toHaveBeenCalledWith('key1');
			expect(redis.del).toHaveBeenCalledWith('key2');
		});
	});

	describe('deleteAccount', () => {
		it('should delete user and clear system-wide cache', async () => {
			const userId = '123';

			await webService.deleteAccount({ id: userId });

			expect(WebRepository.deleteUser).toHaveBeenCalledWith({ id: userId });
			expect(redis.keys).toHaveBeenCalledWith('*');
			expect(redis.del).toHaveBeenCalledWith('key1');
			expect(redis.del).toHaveBeenCalledWith('key2');
		});
	});

	describe('updateUser', () => {
		it('should update user', async () => {
			const userId = '123';
			const updates = { name: 'John Doe' };

			await webService.updateUser({ id: userId, updates });

			expect(WebRepository.updateUser).toHaveBeenCalledWith({ id: userId, updates });
		});
	});

	describe('getUser', () => {
		it('should get user', async () => {
			const userId = '123';
			const tenantId = '456';

			await webService.getUser({ id: userId, tenant_id: tenantId });

			expect(WebRepository.getUser).toHaveBeenCalledWith({ id: userId, tenant_id: tenantId });
		});
	});
});
