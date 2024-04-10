export function SearchService(db) {
	return {
		search: async (q = '', pagination = { perPage: 25, currentPage: 1, sort: 'asc' }) => {
			let query = db.select('*').from('tenants').orderBy('name', pagination.sort);

			if (q.trim() !== '') {
				query.where('name', 'like', `%${q}%`);
			}

			const tenants = await query.paginate({
				...pagination,
				isLengthAware: true,
			});

			tenants.pagination.sort = pagination.sort;

			tenants.pagination.links = Array.from(
				{ length: tenants.pagination.lastPage },
				(_, i) =>
					`q=${q}&current_page=${i + 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`,
			);

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
