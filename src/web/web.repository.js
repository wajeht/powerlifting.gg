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
		getApprovedTenants: async () => {
			return await db.select('*').from('tenants').where({ approved: true });
		},
		getRandomApprovedTenants: async ({ size = 5 } = {}) => {
			return await db
				.select('*')
				.from('tenants')
				.where('approved', true)
				.where('ratings', '>=', 3.5)
				.orderByRaw('RANDOM()')
				.limit(size);
		},
		getRandomReviews: async ({ size = 5 }) => {
			return await db('reviews')
				.select(
					'reviews.*',
					'users.username',
					'users.profile_picture',
					'tenants.ratings as tenant_ratings',
				)
				.join('tenants', 'tenants.id', 'reviews.tenant_id')
				.join('users', 'reviews.user_id', 'users.id')
				.orderByRaw('RANDOM()')
				.where('tenants.ratings', '>=', 3.5)
				.where('tenants.approved', true)
				.whereRaw('LENGTH(reviews.comment) <= 100')
				.limit(size);
		},
		postTenant: async function ({ logo = '', banner = '', slug, name, links }) {
			return await db('tenants')
				.insert({
					logo,
					links: JSON.stringify(links),
					banner,
					slug,
					name,
				})
				.returning('*');
		},
	};
}
