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

import { swagger as swaggerConfig } from './conifg/swagger.js';
import { web as webRoutes } from './web/web.router.js';
import { api as apiRoutes } from './api/api.router.js';

import { rateLimit } from 'express-rate-limit';
import { redis } from './database/db.js';
import { app as appConfig } from './conifg/app.js';
import {
	notFoundHandler,
	errorHandler,
	rateLimitHandler,
	localVariables,
	skipOnMyIp,
} from './app.middlewares.js';

const redisStore = new RedisStore({
	client: redis,
	prefix: 'powerlifting-gg-session-store:',
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (appConfig.env === 'production') {
	app.use(cors());
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'default-src': ["'self'", 'plausible.jaw.dev '],
					'script-src': [
						"'self'",
						"'unsafe-inline'",
						"'unsafe-eval'",
						'jaw.lol',
						'localhost',
						'plausible.jaw.dev',
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

app.use(flash());
app.use(
	session({
		secret: appConfig.session_secret,
		resave: true,
		store: redisStore,
		saveUninitialized: false,
		proxy: appConfig.env === 'production',
		cookie: {
			httpOnly: appConfig.env === 'production',
			secure: appConfig.env === 'production',
		},
	}),
);

app.use(
	express.static(path.resolve(path.join(process.cwd(), 'public')), {
		maxAge: '24h',
	}),
);
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
