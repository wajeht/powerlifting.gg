export function TenantService(db, redis) {
	return {
		getTenant: async (tenantId) => {
			return await db.select('*').from('tenants').where({ id: tenantId }).first();
		},
		getAllTenant: async ({ cache = true } = {}) => {
			if (!cache) {
				return await db.select('*').from('tenants');
			}

			let tenants = await redis.get('tenants');

			if (!tenants) {
				tenants = await db.select('*').from('tenants');
				await redis.set('tenants', JSON.stringify(tenants));
			} else {
				tenants = JSON.parse(tenants);
			}

			return tenants;
		},
		updateRatings: async (tenantId) => {
			const reviews = await db('reviews').where({ tenant_id: tenantId });
			const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
			const averageRating = reviews.length ? totalRating / reviews.length : null;
			await db('tenants').where({ id: tenantId }).update({ ratings: averageRating });
		},
	};
}
