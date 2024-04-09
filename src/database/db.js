import knex from 'knex';
import knexConfig from './knexfile.js';
import { attachPaginate } from 'knex-paginate';

attachPaginate();

export { redis } from './redis.js';
export const db = knex(knexConfig);
