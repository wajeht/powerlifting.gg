import axios from 'axios';
import Users from './Users.vue';
import { it, vi, expect } from 'vitest';
import { render, waitFor } from '@testing-library/vue';

vi.mock('axios');

it('should be able to get users on load', async () => {
	axios.get.mockResolvedValue({
		data: {
			data: [
				{
					id: 1,
					username: 'Maida30',
					email: 'Darrel_Pagac@yahoo.com',
					password: '$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O',
					emoji: '🚥',
					role: 'USER',
					tenant_id: 2,
					created_at: '2024-03-26 14:32:17',
					updated_at: '2024-03-26 14:32:17',
				},
			],
		},
	});

	const { getByText } = render(Users);

	await waitFor(() => getByText('Maida30'));
	expect(axios.get).toHaveBeenCalledWith('/api/users');
});
