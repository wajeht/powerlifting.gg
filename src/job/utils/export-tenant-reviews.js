import papa from 'papaparse';
import { db } from '../../database/db.js';
import { logger } from '../../utils/logger.js';
import fs from 'fs';

export async function exportTenantReviews({ job, tenant_id }) {
	try {
		job.updateProgress(0);

		const reviews = await db.select('*').from('reviews').where({ tenant_id });

		const filePath = `./${Date.now().toString()}-tenant-id-${tenant_id}-reviews.csv`;
		const writableStream = fs.createWriteStream(filePath);

		const csv = papa.unparse(reviews, { header: true });

		writableStream.write(csv);

		writableStream.end(() => {
			logger.info('File successfully written!');
			job.updateProgress(100);
		});
	} catch (error) {
		logger.error('failed to export tenant reviews', error);
	}
}
