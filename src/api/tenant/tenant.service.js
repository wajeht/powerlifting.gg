export function TenantService(db, redis, dayjs) {
	return {
		getTenant: async ({ tenantId, cache = true }) => {
			if (!cache) {
				return await db.select('*').from('tenants').where({ id: tenantId }).first();
			}

			let tenant = await redis.get(`tenant:${tenantId}`);

			if (!tenant) {
				tenant = await db.select('*').from('tenants').where({ id: tenantId }).first();
				await redis.set(`tenant:${tenantId}`, JSON.stringify(tenant));
			} else {
				tenant = JSON.parse(tenant);
			}

			return tenant;
		},
		getAllTenant: async ({ cache = true }) => {
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
		addReviewToTenant: async ({ tenantId, userId, comment, rating }) => {
			const [reviewId] = await db('reviews').insert({
				tenant_id: tenantId,
				user_id: userId,
				comment,
				rating,
			});

			const review = await db('reviews')
				.select('reviews.*', 'users.username as reviewer_username')
				.leftJoin('users', 'reviews.user_id', 'users.id')
				.where('reviews.id', reviewId)
				.first();

			await redis.del(`tenants-${tenantId}-reviews`);

			return review;
		},
		getTenantReviews: async ({ tenantId, cache = true }) => {
			if (!cache) {
				let reviews = await db
					.select('*')
					.from('reviews')
					.leftJoin('users', 'reviews.user_id', 'users.id')
					.orderBy('reviews.created_at', 'desc')
					.where('reviews.tenant_id', tenantId);
				reviews = reviews.map((r) => ({ ...r, created_at: dayjs(r.created_at).fromNow() }));
				return reviews;
			}

			let reviews = await redis.get(`tenants-${tenantId}-reviews`);

			if (!reviews) {
				reviews = await db
					.select('*')
					.from('reviews')
					.leftJoin('users', 'reviews.user_id', 'users.id')
					.orderBy('reviews.created_at', 'desc')
					.where('reviews.tenant_id', tenantId);
				reviews = reviews.map((r) => ({ ...r, created_at: dayjs(r.created_at).fromNow() }));

				await redis.set(`tenants-${tenantId}-reviews`, JSON.stringify(reviews));
			} else {
				reviews = JSON.parse(reviews);
			}

			return reviews;
		},
		updateRatings: async ({ tenantId }) => {
			const reviews = await db('reviews').where({ tenant_id: tenantId });
			const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
			const averageRating = reviews.length ? totalRating / reviews.length : null;
			await db('tenants').where({ id: tenantId }).update({ ratings: averageRating });
		},
	};
}
