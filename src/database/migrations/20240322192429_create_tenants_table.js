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
		table.string('og_image').nullable().defaultTo('/img/og.jpeg');
		table.text('links').nullable().defaultTo('[]');
		table.boolean('verified').notNullable().defaultTo(false);
		table.boolean('approved').notNullable().defaultTo(false);
		table.float('ratings').nullable().defaultTo(0);
		table.integer('ratings_calibration_count').nullable().defaultTo(0);
		table.timestamp('ratings_calibrated_at').nullable().defaultTo(knex.fn.now());
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
