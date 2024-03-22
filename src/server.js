import { app } from './app.js';
import { env } from './conifg/env.js';
import { logger } from './utils/logger.js'

app.listen(env.port, () => {
	logger.info(`Server was started on http://localhost:${env.port}`);
});
