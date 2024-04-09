export function SearchService(db) {
	return {
		search: async (q = '', pagination = { perPage: 25, currentPage: 1, sort: 'asc' }) => {
			const tenants = await db
				.select('*')
				.from('tenants')
				.where('name', 'like', `%${q}%`)
				.orderBy('name', pagination.sort)
				.paginate({
					...pagination,
					isLengthAware: true,
				});

			tenants.pagination.sort = pagination.sort;
			return tenants;
		},
	};
}
