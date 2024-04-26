import { NotFoundError } from '../../app.error.js';

export function TenantService(db, redis, dayjs, badWord) {
	return {
		getTenant: async function ({ tenantId, cache = true }) {
			if (!cache) {
				return await db.select('*').from('tenants').where({ id: tenantId }).first();
			}

			let tenant = await redis.get(`tenants-${tenantId}`);

			if (!tenant) {
				tenant = await db.select('*').from('tenants').where({ id: tenantId }).first();

				if (!tenant) {
					throw new NotFoundError();
				}

				await redis.set(`tenants-${tenantId}`, JSON.stringify(tenant));
			} else {
				tenant = JSON.parse(tenant);
			}

			return tenant;
		},
		getAllTenant: async function ({ cache = true }) {
			if (!cache) {
				return await db
					.select('tenants.*')
					.leftJoin('reviews', 'tenants.id', 'reviews.tenant_id')
					.groupBy('tenants.id')
					.orderBy('name')
					.count('reviews.id as reviews_count')
					.from('tenants');
			}

			let tenants = await redis.get('tenants');

			if (!tenants) {
				tenants = await db
					.select('tenants.*')
					.leftJoin('reviews', 'tenants.id', 'reviews.tenant_id')
					.groupBy('tenants.id')
					.orderBy('name')
					.count('reviews.id as reviews_count')
					.from('tenants');
				await redis.set('tenants', JSON.stringify(tenants));
			} else {
				tenants = JSON.parse(tenants);
			}

			return tenants;
		},
		clearGetAllTenantCache: async function () {
			const keys = await redis.keys('*');
			for (const i of keys) {
				if (i.includes('search?q=&per_page=')) {
					await redis.del(i);
				}
			}
		},
		addReviewToTenant: async function ({ tenant_id, user_id, comment, ratings }) {
			const [reviewId] = await db('reviews').insert({
				tenant_id,
				user_id,
				comment: new badWord().clean(comment),
				ratings,
			});

			const review = await db('reviews')
				.select('reviews.*', 'users.username as reviewer_username')
				.leftJoin('users', 'reviews.user_id', 'users.id')
				.where('reviews.id', reviewId)
				.first();

			await this.clearTenantReviewsCache(tenant_id);

			await this.updateRatings({ tenantId: tenant_id });

			return review;
		},
		clearTenantReviewsCache: async function (tenantId) {
			const keys = await redis.keys('*');
			for (const i of keys) {
				if (i.includes(`tenants-${tenantId}-reviews`)) {
					await redis.del(i);
				}
			}
		},
		getTenantReviews: async function (
			q = '',
			tenantId,
			pagination = { perPage: 25, currentPage: 1, sort: 'desc', cache: true },
		) {
			const cacheKey = `tenants-${tenantId}-reviews?q=${encodeURIComponent(q)}&per_page=${pagination.perPage}&current_page=${pagination.currentPage}&sort=${pagination.sort}`;

			if (pagination.cache) {
				const cachedData = await redis.get(cacheKey);
				if (cachedData) {
					return JSON.parse(cachedData);
				}
			}

			const query = db
				.select('reviews.*', 'users.*', 'reviews.created_at as created_at')
				.from('reviews')
				.leftJoin('users', 'reviews.user_id', 'users.id')
				.orderBy('reviews.created_at', pagination.sort)
				.where('reviews.tenant_id', tenantId);

			if (q.trim() !== '') {
				query.andWhere('reviews.comment', 'like', `%${q}%`);
			}

			let reviews = await query.paginate({
				...pagination,
				isLengthAware: true,
			});

			reviews.data = reviews.data.map((r) => ({ ...r, time_ago: dayjs(r.created_at).fromNow() }));

			reviews.pagination.sort = pagination.sort;

			reviews.pagination.links = Array.from(
				{ length: reviews.pagination.lastPage },
				(_, i) =>
					`q=${q}&current_page=${i + 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`,
			);

			if (reviews.pagination.prevPage !== null) {
				reviews.pagination.prevPageLink = `q=${q}&current_page=${pagination.currentPage - 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`;
			}

			if (reviews.pagination.nextPage !== null) {
				reviews.pagination.nextPageLink = `q=${q}&current_page=${pagination.currentPage + 1}&per_page=${pagination.perPage}&sort=${pagination.sort}`;
			}

			if (pagination.cache) {
				await redis.set(cacheKey, JSON.stringify(reviews));
			}

			return reviews;
		},
		updateRatings: async function ({ tenantId }) {
			const reviews = await db('reviews').where({ tenant_id: tenantId });
			const totalRating = reviews.reduce((acc, curr) => acc + curr.ratings, 0);
			const averageRating = reviews.length ? totalRating / reviews.length : null;
			await db('tenants').where({ id: tenantId }).update({ ratings: averageRating });
		},
		getTenantSearch: async function (
			q = '',
			pagination = { perPage: 25, currentPage: 1, sort: 'asc', cache: true },
		) {
			const cacheKey = `search?q=${encodeURIComponent(q)}&per_page=${pagination.perPage}&current_page=${pagination.currentPage}&sort=${pagination.sort}`;

			if (pagination.cache) {
				const cachedData = await redis.get(cacheKey);
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
