import './env.js';
import sentryNode from '@sentry/node';

export const sentryConfig = Object.freeze({
	dsn: process.env.SENTRY_DSN,
});

export function sentry(app, env) {
	const isProduction = env === 'production';
	return {
		init: function () {
			if (!isProduction) return;

			sentryNode.init({
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
			if (!isProduction) {
				return (req, res, next) => {
					console.log('skipping sentry request handler');
					next();
				};
			}
			return sentryNode.Handlers.requestHandler();
		},
		tracingHandler: function () {
			if (!isProduction) {
				return (req, res, next) => {
					console.log('skipping sentry request handler');
					next();
				};
			}
			return sentryNode.Handlers.tracingHandler();
		},
		errorHandler: function () {
			if (!isProduction) {
				return (req, res, next) => {
					console.log('skipping sentry request handler');
					next();
				};
			}
			return sentryNode.Handlers.errorHandler();
		},
	};
}
