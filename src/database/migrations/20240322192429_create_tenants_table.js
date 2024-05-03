/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('tenants', function (table) {
		table.increments('id').primary();
		table.string('name').notNullable().index();
		table.string('slug').notNullable().unique();
		table.string('banner').nullable().defaultTo('/img/crowd.jpg');
		table.string('logo').nullable().defaultTo('/img/west-side.jpg');
		table.text('links').nullable().defaultTo('[]');
		table.boolean('verified').notNullable().defaultTo(false);
		table.float('ratings').nullable().defaultTo(0);
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable('tenants');
}
