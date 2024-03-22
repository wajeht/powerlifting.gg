import { app } from './app.js';
import { env } from './conifg/env.js';

app.listen(env.port, () => {
	console.log(`Server was started on http://localhost:${env.port}`);
});
