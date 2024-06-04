import { logger } from '../../utils/logger.js';
import { db } from '../../database/db.js';

async function updateRatings(tenantId) {
	const reviews = await db('reviews').where({ tenant_id: tenantId });
	const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
	const averageRating = reviews.length ? totalRating / reviews.length : null;
	await db('tenants').where({ id: tenantId }).update({ ratings: averageRating });
	logger.info(`Updated tenant ID: ${tenantId} with average rating: ${averageRating}`);
}

export async function calibrateRatings({ ids = [] } = {}) {
	const tenants = await db('tenants').whereIn('id', ids).andWhere({ approved: true });
	for (const tenant of tenants) {
		await updateRatings(tenant.id);
	}
	logger.info('All tenant ratings updated successfully');
}
