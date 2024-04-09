import { app as appConfig } from './app.js';
import path from 'path';

let DOMAIN = '';

if (appConfig.env === 'production') {
	DOMAIN = appConfig.production_app_url;
} else {
	DOMAIN = appConfig.development_app_url;
}

export const swagger = {
	info: {
		title: 'powerlifting.gg',
		description: 'multitenancy coaching review systems',
		termsOfService: `http://${DOMAIN}/terms-of-services/`,
		contact: {
			name: 'Support',
			url: `http://${DOMAIN}/contact`,
		},
		license: {
			name: 'MIT',
			url: 'https://github.com/wajeht/powerlifting.gg/blob/main/LICENSE',
		},
		version: '0.0.1',
	},
	baseDir: path.resolve(path.join(process.cwd(), 'src')),
	filesPattern: ['./**/*.router.js'],
	swaggerUIPath: '/api-docs',
	exposeSwaggerUI: true,
	notRequiredAsNullable: false,
	swaggerUiOptions: {},
	multiple: {},
};
