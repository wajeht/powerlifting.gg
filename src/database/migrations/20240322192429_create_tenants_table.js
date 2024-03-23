/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('tenants', function (table) {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('slug').notNullable().unique();
		table.string('emoji').nullable().defaultTo('💡');
		table.string('color').nullable().defaultTo('black');
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
