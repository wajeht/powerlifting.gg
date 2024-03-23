import request from 'supertest';
import { it, expect } from 'vitest';
import { app as server } from '../app.js';

const app = request(server);

it('should be able to get /healthz end point', async () => {
	const res = await app.get('/healthz');
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty('message');
	expect(res.body).toHaveProperty('date');
});
