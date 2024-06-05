import './env.js';
import sentryNode from '@sentry/node';

export const sentryConfig = Object.freeze({
	dsn: process.env.SENTRY_DSN,
});

export function sentry(app) {
	return {
		init: () => {
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
		requestHandler: () => {
			return sentryNode.Handlers.requestHandler();
		},
		tracingHandler: () => {
			return sentryNode.Handlers.tracingHandler();
		},
		errorHandler: () => {
			return sentryNode.Handlers.errorHandler();
		},
	};
}
