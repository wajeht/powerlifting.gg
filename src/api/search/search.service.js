export function SearchService(db) {
	return {
		search: async (q = '', pagination = { perPage: 25, currentPage: 1 }) => {
			return await db
				.select('*')
				.from('tenants')
				.where('name', 'like', `%${q}%`)
				.orderBy('name')
				.paginate({
					...pagination,
					isLengthAware: true,
				});
		},
	};
}
