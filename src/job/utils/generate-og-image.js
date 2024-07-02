import axios from 'axios';
import sharp from 'sharp';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { publicS3BucketConfig, backBlaze } from '../../config/back-blaze.js';
import { logger } from '../../utils/logger.js';

export async function generateOgImage({ tenant, job }) {
	try {
		const bannerUrl = tenant.banner;
		const response = await axios({
			url: bannerUrl,
			responseType: 'arraybuffer',
		});

		const imageKey = `${Date.now().toString()}.jpeg`;

		const resizedImageBuffer = await sharp(response.data).resize(1200, 630).jpeg().toBuffer();

		const uploadParams = {
			Bucket: process.env.PUBLIC_BACKBLAZE_BUCKET,
			Key: imageKey,
			Body: resizedImageBuffer,
			ContentType: 'image/jpeg',
		};

		const command = new PutObjectCommand(uploadParams);
		await publicS3BucketConfig.send(command);

		const uploadedImageUrl = `${backBlaze.public.end_point}/${process.env.PUBLIC_BACKBLAZE_BUCKET}/${imageKey}`;

		logger.info(`Image uploaded successfully for job ${job.id}`);
		return uploadedImageUrl;
	} catch (error) {
		logger.error('Error processing image:', error);
		throw error;
	}
}
