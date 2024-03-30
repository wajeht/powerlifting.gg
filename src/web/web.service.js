export function WebService(WebRepository) {
	return {
		getUser: async ({ id, tenant_id }) => {
			return await WebRepository.getUser({ id, tenant_id });
		},
	};
}
