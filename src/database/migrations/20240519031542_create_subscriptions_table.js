/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('subscriptions', function (table) {
		table.increments('id').index();
		table.string('email').notNullable().unique().index(); // no `user_id` so public user can subscript to it
		table
			.text('subscriptions')
			.notNullable()
			.defaultTo(
				JSON.stringify({
					newsletter: false,
					changelog: false,
					promotions: false,
				}),
			);
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
