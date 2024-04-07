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
	};
}
