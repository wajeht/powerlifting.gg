import axios from 'axios';
import Users from './Users.vue';
import { it, vi } from 'vitest';
import {render } from '@testing-library/vue';

vi.mock('axios');

it.skip('should work', async ()=> {
  axios.get.mockResolvedValue({ data: [{
    "id": 14,
    "username": "Kylee.Moen-Treutel23",
    "email": "Rosetta.Bauch@hotmail.com",
    "password": "$2a$10$gc6r7krvlLBEakYQYz5cZupxF5tuO3uGqmj/cJly4gzGmeiNEco8O",
    "emoji": "🥉",
    "role": "USER",
    "tenant_id": 1,
    "created_at": "2024-03-25 23:59:36",
    "updated_at": "2024-03-25 23:59:36"
  }]})

  const { getByText } = render(Users);

   getByText('x');
});
