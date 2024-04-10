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
	};
}
