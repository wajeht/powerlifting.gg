export function WebRepository(db) {
	return {
		getUser: async ({ id, tenant_id }) => {
			return await db.delete().from('users').where({ tenant_id, id });
		},
	};
}
