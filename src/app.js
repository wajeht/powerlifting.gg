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
import Sentry from '@sentry/node';

import { expressJSDocSwaggerHandler } from './config/swagger.js';
import { setupBullDashboard } from './job/job.js';
import { web as webRoutes } from './web/web.router.js';
import { api as apiRoutes } from './api/api.router.js';
import { swagger as swaggerConfig } from './config/swagger.js';

import { redis } from './database/db.js';
import { rateLimit } from 'express-rate-limit';
import { app as appConfig } from './config/app.js';
import { session as sessionConfig } from './config/session.js';
import { sentry as sentryConfig } from './config/sentry.js';
import {
	notFoundHandler,
	errorHandler,
	rateLimitHandler,
	localVariables,
	skipOnMyIp,
} from './app.middleware.js';

const redisStore = new RedisStore({
	client: redis,
	prefix: sessionConfig.store_prefix,
	disableTouch: true,
});

const app = express();

Sentry.init({
	dsn: sentryConfig.dsn,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Sentry.Integrations.Express({ app }),
	],
	tracesSampleRate: 1.0,
	profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.set('trust proxy', true);

app.use(
	session({
		secret: sessionConfig.secret,
		resave: true,
		saveUninitialized: true,
		store: redisStore,
		proxy: appConfig.env === 'production',
		cookie: {
			httpOnly: false,
			// prettier-ignore
			domain: appConfig.env === 'production' ? `.${appConfig.production_app_url}` : `.${appConfig.development_app_url}`,
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
app.use(cors());

if (appConfig.env === 'production') {
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
						'jaw.lol',
					],
					'script-src': [
						"'self'",
						"'unsafe-inline'",
						"'unsafe-eval'",
						'plausible.jaw.dev',
						'powerlifting.gg',
						'localtest.me',
						'jaw.lol',
						'blob:',
						'text/javascript',
						'https://jaw.dev/',
					],
					'script-src-elem': ["'self'", "'unsafe-inline'", 'https://plausible.jaw.dev'],
					'script-src-attr': ["'self'", "'unsafe-inline'"],
					'img-src': [
						"'self'",
						'https://lh3.googleusercontent.com/',
						'https://s3.us-east-005.backblazeb2.com',
						'data:',
						'blob:',
					],
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

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

if (appConfig.env === 'production') {
	app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '24h' }));
} else {
	app.use(express.static(path.resolve(path.join(process.cwd(), 'public'))));
}

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('view options', { outputFunctionName: 'render' });
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'web', 'views', 'pages')));
app.set(
	'layout',
	path.resolve(path.join(process.cwd(), 'src', 'web', 'views', 'layouts', 'main.html')),
);

app.use(localVariables);

setupBullDashboard(app);
expressJSDocSwaggerHandler(app, swaggerConfig);

app.use(expressLayouts);

app.use(apiRoutes);
app.use(webRoutes);

app.use(Sentry.Handlers.errorHandler());
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
