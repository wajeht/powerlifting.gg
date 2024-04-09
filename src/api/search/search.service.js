export function SearchService(db) {
	return {
		search: async (q, pagination = { q: '', perPage: 25, currentPage: 1 }) => {
			if (q === '') return [];
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
