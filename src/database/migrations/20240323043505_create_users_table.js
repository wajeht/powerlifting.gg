/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments('id').primary();
		table.string('username').notNullable().unique().index();
		table.string('email').notNullable().unique().index();
		table.string('profile_picture').notNullable().defaultTo('/img/chad.jpeg');
		table.enu('role', ['USER', 'ADMIN', 'SUPER_ADMIN']).notNullable().defaultTo('USER');
		table.integer('tenant_id').unsigned().notNullable();
		table.foreign('tenant_id').references('id').inTable('tenants');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable('users');
}
