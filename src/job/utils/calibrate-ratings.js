import { logger } from '../../utils/logger.js';
import { db } from '../../database/db.js';

async function updateRatings(tenantId) {
	try {
		const reviews = await db('reviews').where({ tenant_id: tenantId });
		const totalRating = reviews.reduce((acc, curr) => acc + curr.ratings, 0);
		const averageRating = reviews.length ? totalRating / reviews.length : null;

		const tenant = await db('tenants').where({ id: tenantId }).first();
		const count = parseInt(tenant.ratings_calibration_count) + 1;

		await db('tenants').where({ id: tenantId }).update({
			ratings: averageRating,
			ratings_calibrated_at: db.fn.now(),
			ratings_calibration_count: count,
		});

		logger.info(`Updated tenant ID: ${tenantId} with average rating: ${averageRating}`);
	} catch (error) {
		logger.error(`Failed to update ratings for tenant ID: ${tenantId}`, error);
		throw error;
	}
}

export async function calibrateRatings({ ids = [] } = {}) {
	try {
		const tenants = await db('tenants').whereIn('id', ids).andWhere({ approved: true });

		for (const tenant of tenants) {
			await updateRatings(tenant.id);
		}

		logger.info('All tenant ratings updated successfully');
	} catch (error) {
		logger.error('Failed to calibrate ratings for tenants', error);
		throw error;
	}
}
