import knex from 'knex';
import knexConfig from './knexfile.js';

export { redis } from './redis.js';
export const db = knex(knexConfig);
