import { app as appConfig } from './app.js';
import path from 'path';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import {
	authenticationHandler,
	authorizePermissionHandler,
	tenantIdentityHandler,
	throwTenancyHandler,
} from '../app.middleware.js';

let DOMAIN = '';

if (appConfig.env === 'production') {
	DOMAIN = appConfig.production_app_url;
} else {
	DOMAIN = appConfig.development_app_url;
}

export const swagger = Object.freeze({
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
	swaggerUiOptions: {
		customSiteTitle: 'powerlifting.gg | api documentation',
		customfavIcon: '/favicon.ico',
	},
	multiple: {},
});

export function expressJSDocSwaggerHandler(app, swaggerConfig) {
	app.use(
		'/api-docs',
		tenantIdentityHandler,
		throwTenancyHandler,
		authenticationHandler,
		authorizePermissionHandler('SUPER_ADMIN'),
	);
	expressJSDocSwagger(app)(swaggerConfig);
}
