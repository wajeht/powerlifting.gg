import { logger } from '../utils/logger.js';
import { app as appConfig } from '../config/app.js';
import { discord as discordConfig } from '../config/discord.js';
import axios from 'axios';

export async function alertDiscord(msg, object = null) {
	try {
		if (appConfig.env !== 'production') {
			logger.warn('Skipping Discord bot in dev environment!');
			return;
		}

		let params;

		if (object === null) {
			params = { username: 'Powerlifting.gg', content: msg };
		} else {
			params = {
				username: 'Powerlifting.gg',
				content: msg,
				embeds: [{ title: msg, description: object }],
			};
		}

		const res = await axios.post(discordConfig.url, params, {
			headers: { 'Content-Type': 'application/json' },
		});

		if (res.status === 204) {
			logger.info(`Discord bot has sent: ${msg}`);
		}
	} catch (error) {
		console.error(error);
	}
}
