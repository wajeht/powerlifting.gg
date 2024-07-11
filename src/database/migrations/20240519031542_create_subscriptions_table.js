/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable('subscriptions', function (table) {
		table.increments('id').index();
		table.string('email').notNullable().unique().index(); // no `user_id` so public user can subscribe to it
		table
			.text('type')
			.notNullable()
			.defaultTo(
				JSON.stringify({
					newsletter: false,
					changelog: false,
					promotion: false,
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
