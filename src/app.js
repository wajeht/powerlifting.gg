import path from 'path';
import ejs from 'ejs';
import expressLayouts from 'express-ejs-layouts';
import cors from 'express';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import routes from './views/routes.js';
import {
	notFoundHandler,
	errorHandler,
	rateLimitHandler,
	localVariables,
} from './app.middlewares.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				'default-src': ["'self'", 'plausible.jaw.dev '],
				'script-src': [
					"'self'",
					"'unsafe-inline'",
					'dogs.jaw.dev',
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
	}),
);

app.use(
	express.static(path.resolve(path.join(process.cwd(), 'public')), {
		maxAge: '24h',
	}),
);
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'views', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'views', 'layouts', 'main.html')));

app.use(localVariables);
app.use(expressLayouts);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
