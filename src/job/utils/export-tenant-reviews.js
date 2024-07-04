import fs from 'fs';
import papa from 'papaparse';

import { db } from '../../database/db.js';
import { logger } from '../../utils/logger.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { publicS3BucketConfig, backBlaze } from '../../config/back-blaze.js';

export async function exportTenantReviews({ job, tenant_id }) {
	try {
		job.updateProgress(0);

		const reviews = await db.select('*').from('reviews').where({ tenant_id });
		job.updateProgress(25);

		const csv = papa.unparse(reviews, { header: true });
		job.updateProgress(50);

		const filePath = `./src/tmp/${Date.now().toString()}-tenant-id-${tenant_id}-reviews.csv`;
		fs.writeFileSync(filePath, csv);
		job.updateProgress(75);

		const fileStream = fs.createReadStream(filePath);
		const fileName = filePath.split('/').pop();
		const uploadParams = {
			Bucket: process.env.PUBLIC_BACKBLAZE_BUCKET,
			Key: fileName,
			Body: fileStream,
			ContentType: 'text/csv',
		};

		const command = new PutObjectCommand(uploadParams);
		await publicS3BucketConfig.send(command);

		const uploadedImageUrl = `${backBlaze.public.end_point}/${process.env.PUBLIC_BACKBLAZE_BUCKET}/${fileName}`;
		logger.info(`CSV file successfully uploaded to S3: ${uploadedImageUrl}`);
		job.updateProgress(100);

		fs.unlinkSync(filePath);
	} catch (error) {
		logger.error(error);
		logger.error('failed to export tenant reviews', error);
		job.updateProgress(100);
	}
}

// function j() {
//     return {
//         updateProgress: function (value) {
//             console.log(value);
//         }
//     }
// }

// const job = j();

// await exportTenantReviews({ job, tenant_id: 1 })
