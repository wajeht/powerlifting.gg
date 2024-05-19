/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('subscriptions', function (table) {
		table.increments('id').index();
		table.string('email').notNullable().unique().index();
		table.boolean('newsletter').defaultTo(false);
		table.boolean('changelog').defaultTo(false);
		table.boolean('promotion').defaultTo(false);
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable('subscriptions');
}
