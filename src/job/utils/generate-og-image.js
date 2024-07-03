import axios from 'axios';
import sharp from 'sharp';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { publicS3BucketConfig, backBlaze } from '../../config/back-blaze.js';
import { logger } from '../../utils/logger.js';
import { db } from '../../database/db.js';

export async function generateOgImage({ tenant, job }) {
	try {
		job.updateProgress(0);

		const bannerUrl = tenant.banner;

		if (!bannerUrl) {
			logger.info(
				`no banner image to generate og image for tenant: ${tenant.slug}. exiting generateOgImage job.`,
			);
			job.updateProgress(100);
			return;
		}

		const response = await axios({
			url: bannerUrl,
			responseType: 'arraybuffer',
		});

		const imageKey = `${Date.now().toString()}.jpeg`;

		job.updateProgress(25);

		const resizedImageBuffer = await sharp(response.data).resize(1200, 630).jpeg().toBuffer();

		job.updateProgress(75);

		const uploadParams = {
			Bucket: process.env.PUBLIC_BACKBLAZE_BUCKET,
			Key: imageKey,
			Body: resizedImageBuffer,
			ContentType: 'image/jpeg',
		};

		const command = new PutObjectCommand(uploadParams);
		await publicS3BucketConfig.send(command);

		logger.info(`og image uploaded successfully for tenant ${tenant.slug}`);

		job.updateProgress(100);

		const uploadedImageUrl = `${backBlaze.public.end_point}/${process.env.PUBLIC_BACKBLAZE_BUCKET}/${imageKey}`;

		await db('tenants').where({ id: tenant.id }).update({ og_image: uploadedImageUrl });
	} catch (error) {
		logger.error('error processing og image:', error);
		throw error;
	}
}
