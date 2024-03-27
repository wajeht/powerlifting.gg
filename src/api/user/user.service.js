export function UserService(db) {
	return {
		getUsers: async () => {
			return await db.select('*').from('users');
		},
		getTenantUsers: async (tenantId) => {
			return await db.select('*').from('users').where({ tenant_id: tenantId });
		},
	};
}
