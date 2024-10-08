import path from 'node:path';
import ejs from 'ejs';
import expressLayouts from 'express-ejs-layouts';
import cors from 'cors';
import compression from 'compression';
import express from 'express';
import flash from 'connect-flash';

import { web as webRoutes } from './web/web.router.js';
import { api as apiRoutes } from './api/api.router.js';
import { expressJSDocSwaggerHandler } from './config/swagger.js';
import { setupBullDashboard } from './job/job.js';
import { swagger as swaggerConfig } from './config/swagger.js';
import { getIpAddress } from './utils/get-ip-address.js';

import { app as appConfig } from './config/app.js';
import {
	notFoundHandler,
	errorHandler,
	rateLimitHandler,
	helmetHandler,
	localVariables,
	sessionHandler,
} from './app.middleware.js';

const app = express();

app.set('trust proxy', true);

app.use(sessionHandler());

app.use(flash());
app.use(compression());
app.disable('x-powered-by');

app.use(cors());

if (appConfig.env === 'production') {
	app.use(helmetHandler());
	app.use(rateLimitHandler(getIpAddress));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '30d' }));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('view cache', appConfig.env === 'production');
app.set('view options', { outputFunctionName: 'render' });
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'web', 'views', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'web', 'views', 'layouts', 'main.html'))); // prettier-ignore

app.use(localVariables);

setupBullDashboard(app);
expressJSDocSwaggerHandler(app, swaggerConfig);

app.use(expressLayouts);

app.use(apiRoutes);
app.use(webRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
