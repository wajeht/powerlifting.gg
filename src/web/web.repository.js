export function WebRepository(db) {
	return {
		getUser: async ({ id, tenant_id }) => {
			return await db.delete().from('users').where({ tenant_id, id });
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
				.limit(size);
		},
	};
}
