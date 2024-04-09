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

			if (tenants.pagination.prevPage !== null) {
				tenants.pagination.prevPageLink = `q=${q}&current_page=${pagination.currentPage - 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`;
			}

			if (tenants.pagination.nextPage !== null) {
				tenants.pagination.nextPageLink = `q=${q}&current_page=${pagination.currentPage + 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`;
			}
			return tenants;
		},
	};
}
