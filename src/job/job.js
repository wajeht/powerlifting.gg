import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

import { sendWelcomeEmailJob, sendWelcomeEmailQueue } from './welcome.job.js';
import { sendContactEmailJob, sendContactEmailQueue } from './contact.job.js';
import { authenticationHandler } from '../app.middleware.js';

export function setupBullDashboard(app) {
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath('/admin/jobs');

	createBullBoard({
		queues: [new BullMQAdapter(sendWelcomeEmailQueue), new BullMQAdapter(sendContactEmailQueue)],
		serverAdapter,
	});

	app.use('/admin/jobs', authenticationHandler, serverAdapter.getRouter());
}

export { sendWelcomeEmailJob, sendContactEmailJob };
