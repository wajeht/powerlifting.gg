import knex from 'knex';
import knexConfig from './knexfile.js';
import { Model } from 'objection';
import { attachPaginate } from 'knex-paginate';

attachPaginate();
Model.knex(knex(knexConfig));

export { redis } from './redis.js';
export const db = knex(knexConfig);
