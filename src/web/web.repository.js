export function WebRepository(db) {
	return {
		getUser: async ({ id = null, tenant_id = null, username = null }) => {
			if (id && tenant_id) {
				return await db.select('*').from('users').where({ tenant_id, id }).first();
			} else if (id) {
				return await db.select('*').from('users').where({ id }).first();
			} else if (username) {
				return await db.select('*').from('users').where({ username }).first();
			}
		},
		getTenants: async () => {
			return await db.select('*').from('tenants');
		},
		getTenantUsers: async ({ tenant_id }) => {
			return await db.select('*').from('users').where({ tenant_id });
		},
		getRandomTenants: async ({ size = 5 } = {}) => {
			return await db.select('*').from('tenants').orderByRaw('RANDOM()').limit(size);
		},
		getRandomReviews: async ({ size = 5 }) => {
			return await db('reviews')
				.select('reviews.*', 'users.username', 'users.profile_picture')
				.join('users', 'reviews.user_id', 'users.id')
				.orderByRaw('RANDOM()')
				.whereRaw('LENGTH(reviews.comment) <= 100')
				.limit(size);
		},
		postTenant: async function ({ logo = '', banner = '', slug, name }) {
			return await db('tenants')
				.insert({
					logo,
					banner,
					slug,
					name,
				})
				.returning('*');
		},
	};
}
