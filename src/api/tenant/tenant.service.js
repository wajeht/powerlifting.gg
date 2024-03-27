export function TenantService(db) {
	return {
		getTenant: async (tenantId) => {
			return await db.select('*').from('tenants').where({ id: tenantId });
		},
	};
}
