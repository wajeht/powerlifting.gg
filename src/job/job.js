import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

import { sendWelcomeEmailJob, sendWelcomeEmailQueue } from './welcome.job.js';
import { sendContactEmailJob, sendContactEmailQueue } from './contact.job.js';
import { scheduleBackupDatabaseJob, scheduleBackupDatabaseQueue } from './backup-database.job.js';
import { sendNewsletterEmailJob, sendNewsletterEmailQueue } from './newsletter.job.js';
import {
	authenticationHandler,
	authorizePermissionHandler,
	catchAsyncErrorHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../app.middleware.js';
import { sendApproveTenantEmailQueue, sendApproveTenantEmailJob } from './approve-tenant.job.js';

export const job = {
	sendWelcomeEmailJob,
	sendContactEmailJob,
	scheduleBackupDatabaseJob,
	sendApproveTenantEmailJob,
	sendNewsletterEmailJob,
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
		],
		serverAdapter,
	});

	app.use(
		'/admin/jobs',
		tenantIdentityHandler,
		throwTenancyHandler,
		authenticationHandler,
		authorizePermissionHandler('SUPER_ADMIN'),
		catchAsyncErrorHandler(serverAdapter.getRouter()),
	);

	return app;
}
