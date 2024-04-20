import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

import { app as appConfig } from '../config/app.js';
import { sendWelcomeEmailJob, sendWelcomeEmailQueue } from './welcome.job.js';
import { sendContactEmailJob, sendContactEmailQueue } from './contact.job.js';
import { scheduleBackupDatabaseJob, scheduleBackupDatabaseQueue } from './backup-database.job.js';
import { authenticationHandler } from '../app.middleware.js';

export function setupBullDashboard(app) {
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath('/admin/jobs');

	createBullBoard({
		queues: [
			new BullMQAdapter(sendContactEmailQueue),
			new BullMQAdapter(sendWelcomeEmailQueue),
			new BullMQAdapter(scheduleBackupDatabaseQueue),
		],
		serverAdapter,
	});

	if (appConfig.env === 'production') {
		app.use('/admin/jobs', authenticationHandler, serverAdapter.getRouter());
	} else {
		app.use('/admin/jobs', serverAdapter.getRouter());
	}
}

export { sendWelcomeEmailJob, sendContactEmailJob, scheduleBackupDatabaseJob };
