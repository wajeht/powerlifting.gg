import path from 'path';
import ejs from 'ejs';
import expressLayouts from 'express-ejs-layouts';
import cors from 'express';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import RedisStore from 'connect-redis';
import expressJSDocSwagger from 'express-jsdoc-swagger';

import { swagger as swaggerConfig } from './config/swagger.js';
import { web as webRoutes } from './web/web.router.js';
import { api as apiRoutes } from './api/api.router.js';

import { rateLimit } from 'express-rate-limit';
import { redis } from './database/db.js';
import { app as appConfig } from './config/app.js';
import {
	notFoundHandler,
	errorHandler,
	rateLimitHandler,
	localVariables,
	skipOnMyIp,
} from './app.middlewares.js';

const redisStore = new RedisStore({
	client: redis,
	prefix: appConfig.session.store_prefix,
	disableTouch: true,
});

const app = express();
app.set('trust proxy', true);
app.use(
	session({
		secret: appConfig.session.secret,
		resave: true,
		saveUninitialized: true,
		store: redisStore,
		proxy: appConfig.env === 'production',
		cookie: {
			httpOnly: false,
			// prettier-ignore
			domain: appConfig.env === 'production' ? `.${appConfig.production_app_url}`: `.${appConfig.development_app_url}`,
			maxAge: 1000 * 60 * 24, // 24 hours
			// // TODO: fix why this aint working for production
			// httpOnly: appConfig.env === 'production',
			// sameSite: appConfig.env === 'production' ? 'none' : 'lax',
			// secure: appConfig.env === 'production',
		},
	}),
);
app.use(flash());
app.use(compression());
app.disable('x-powered-by');

if (appConfig.env === 'production') {
	app.use(
		cors({
			credentials: true,
			origin: true,
		}),
	);
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'default-src': [
						"'self'",
						'plausible.jaw.dev',
						'powerlifting.gg',
						'localtest.me',
						'googleusercontent.com',
						'jaw.lol',
					],
					'script-src': [
						'googleusercontent.com',
						"'self'",
						"'unsafe-inline'",
						'plausible.jaw.dev',
						"'unsafe-eval'",
						'powerlifting.gg',
						'localtest.me',
						'jaw.lol',
						'blob:',
						'text/javascript',
					],
					'img-src': ["'self'", 'googleusercontent.com', 'data:'],
				},
			},
		}),
	);
	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
			standardHeaders: 'draft-7',
			legacyHeaders: false,
			handler: rateLimitHandler,
			skip: skipOnMyIp,
		}),
	);
}

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

if (appConfig.env === 'production') {
	app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '24h' }));
} else {
	app.use(express.static(path.resolve(path.join(process.cwd(), 'public'))));
}

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'web', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'web', 'layouts', 'main.html')));

expressJSDocSwagger(app)(swaggerConfig);
app.use(localVariables);
app.use(expressLayouts);

app.use(apiRoutes);
app.use(webRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
