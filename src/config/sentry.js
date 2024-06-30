import './env.js';
import sentryNode from '@sentry/node';

export const sentryConfig = Object.freeze({
	dsn: process.env.SENTRY_DSN,
});

export function sentry(app, env) {
	const isProduction = env === 'production';

	return {
		init: function () {
			if (isProduction) {
				sentryNode.init({
					dsn: sentryConfig.dsn,
					integrations: [
						new sentryNode.Integrations.Http({ tracing: true }),
						new sentryNode.Integrations.Express({ app }),
					],
					tracesSampleRate: 1.0,
					profilesSampleRate: 1.0,
				});
			}
		},
		requestHandler: function () {
			return isProduction ? sentryNode.Handlers.requestHandler() : (req, res, next) => next();
		},
		tracingHandler: function () {
			return isProduction ? sentryNode.Handlers.tracingHandler() : (req, res, next) => next();
		},
		errorHandler: function () {
			return isProduction ? sentryNode.Handlers.errorHandler() : (err, req, res, next) => next(err);
		},
	};
}
