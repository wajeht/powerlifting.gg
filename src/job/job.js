import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

import { sendWelcomeEmailJob, sendWelcomeEmailQueue } from './welcome.job.js';
import { sendContactEmailJob, sendContactEmailQueue } from './contact.job.js';
import { scheduleBackupDatabaseJob, scheduleBackupDatabaseQueue } from './backup-database.job.js';
import { sendNewsletterEmailJob, sendNewsletterEmailQueue } from './newsletter.job.js';
import { sendNewReviewEmailJob, sendNewReviewEmailQueue } from './new-review.job.js';
import { calibrateRatingsQueue, calibrateRatingsJob } from './calibrate-ratings.job.js';
import { generateOgImageJob, generateOgImageQueue } from './generate-og-image.job.js';
import { sendApproveTenantEmailQueue, sendApproveTenantEmailJob } from './approve-tenant.job.js';
import {
	cleanupDatabaseBackupJob,
	cleanupDatabaseBackupQueue,
} from './cleanup-database-backup.job.js';
import { exportTenantReviewsJob, exportTenantReviewsQueue } from './export-tenant-reviews.job.js';
import {
	authenticationHandler,
	authorizePermissionHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../app.middleware.js';

export const job = {
	sendWelcomeEmailJob,
	sendContactEmailJob,
	scheduleBackupDatabaseJob,
	sendApproveTenantEmailJob,
	sendNewsletterEmailJob,
	sendNewReviewEmailJob,
	calibrateRatingsJob,
	generateOgImageJob,
	cleanupDatabaseBackupJob,
	exportTenantReviewsJob,
};

export function setupBullDashboard(app) {
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath('/admin/jobs');

	createBullBoard({
		queues: [
			new BullMQAdapter(sendContactEmailQueue),
			new BullMQAdapter(sendWelcomeEmailQueue),
			new BullMQAdapter(scheduleBackupDatabaseQueue),
			new BullMQAdapter(sendApproveTenantEmailQueue),
			new BullMQAdapter(sendNewsletterEmailQueue),
			new BullMQAdapter(sendNewReviewEmailQueue),
			new BullMQAdapter(calibrateRatingsQueue),
			new BullMQAdapter(generateOgImageQueue),
			new BullMQAdapter(cleanupDatabaseBackupQueue),
			new BullMQAdapter(exportTenantReviewsQueue),
		],
		serverAdapter,
	});

	app.use(
		'/admin/jobs',
		tenantIdentityHandler,
		throwTenancyHandler,
		authenticationHandler,
		authorizePermissionHandler('SUPER_ADMIN'),
		serverAdapter.getRouter(),
	);

	return app;
}
