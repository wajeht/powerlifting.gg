export function WebRepository(db) {
	return {
		deleteUser: async function ({ id }) {
			return await db('users').where({ id }).del();
		},
		updateUser: async function ({ id, updates }) {
			return await db('users').where({ id }).update(updates).returning('*');
		},
		getUser: async ({ id = null, tenant_id = null, username = null }) => {
			if (id && tenant_id) {
				return await db.select('*').from('users').where({ tenant_id, id }).first();
			} else if (id) {
				return await db.select('*').from('users').where({ id }).first();
			} else if (username) {
				return await db.select('*').from('users').where({ username }).first();
			}
		},
		getAllMyTenants: async (userId) => {
			return await db
				.select('*')
				.from('tenants')
				.join('coaches', 'coaches.tenant_id', 'tenants.id')
				.where({ 'coaches.user_id': userId })
				.orderBy('tenants.created_at', 'desc');
		},
		getApprovedTenants: async () => {
			return await db.select('*').from('tenants').where({ approved: true });
		},
		getTenant: async (tenantId) => {
			return await db
				.select('tenants.*')
				.from('tenants')
				.leftJoin('reviews', 'tenants.id', 'reviews.tenant_id')
				.where({ 'tenants.id': tenantId })
				.count('reviews.id as reviews_count')
				.first();
		},
		getRandomApprovedAndVerifiedTenants: async ({ size = 5 } = {}) => {
			return await db
				.select('*')
				.from('tenants')
				.where('approved', true)
				.andWhere('verified', true)
				.where('ratings', '>=', 3)
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
		postTenant: async function ({ logo = '', banner = '', slug, name, links, verified = false }) {
			return await db('tenants')
				.insert({
					logo,
					links: JSON.stringify(links),
					banner,
					slug,
					name,
					verified,
				})
				.returning('*');
		},
		postCoach: async function ({ tenant_id, user_id, role = 'COACH' }) {
			return await db('coaches').insert({ user_id, tenant_id, role }).returning('*');
		},
		postSubscription: async function ({ email, type }) {
			return await db('subscriptions').insert({ email, type: JSON.stringify(type) });
		},
		updateSubscription: async function ({ email, type }) {
			return await db('subscriptions')
				.where({ email })
				.update({ type: JSON.stringify(type) });
		},
		getSubscription: async function (email) {
			return await db.select('*').from('subscriptions').where({ email }).first();
		},
	};
}
