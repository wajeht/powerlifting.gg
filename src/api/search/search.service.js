export function SearchService(db, redis) {
	return {
		search: async (
			q = '',
			pagination = { perPage: 25, currentPage: 1, sort: 'asc', cache: true },
		) => {
			const cacheKey = `search?q=${encodeURIComponent(q)}&per_page=${pagination.perPage}&current_page=${pagination.currentPage}&sort=${pagination.sort}`;

			if (pagination.cache) {
				let cachedData = await redis.get(cacheKey);
				if (cachedData) {
					return JSON.parse(cachedData);
				}
			}

			const query = db('tenants')
				.select('tenants.*')
				.leftJoin('reviews', 'tenants.id', 'reviews.tenant_id')
				.groupBy('tenants.id')
				.orderBy('name', pagination.sort)
				.count('reviews.id as reviews_count');

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

			if (pagination.cache) {
				await redis.set(cacheKey, JSON.stringify(tenants));
			}

			return tenants;
		},
	};
}
