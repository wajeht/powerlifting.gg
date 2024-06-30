import './env.js';
import sentryNode from '@sentry/node';

export const sentryConfig = Object.freeze({
	dsn: process.env.SENTRY_DSN,
});

export function sentry(app, env) {
	return {
		skipProduction: function () {
			if (env !== 'production') {
				return (req, res, next) => next();
			}
		},
		init: function () {
			this.skipProduction();
			return sentryNode.init({
				dsn: sentryConfig.dsn,
				integrations: [
					new sentryNode.Integrations.Http({ tracing: true }),
					new sentryNode.Integrations.Express({ app }),
				],
				tracesSampleRate: 1.0,
				profilesSampleRate: 1.0,
			});
		},
		requestHandler: function () {
			this.skipProduction();
			return sentryNode.Handlers.requestHandler();
		},
		tracingHandler: function () {
			this.skipProduction();
			return sentryNode.Handlers.tracingHandler();
		},
		errorHandler: function () {
			if (env !== 'production') return (req, res, next) => next();
			return sentryNode.Handlers.errorHandler();
		},
	};
}
