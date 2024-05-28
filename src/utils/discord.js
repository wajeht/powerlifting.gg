import { logger } from '../utils/logger.js';
import { app as appConfig } from '../config/app.js';
import { discord as discordConfig } from '../config/discord.js';
import axios from 'axios';

/* It sends a message to a Discord channel */
// https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9
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
		logger.alert(error);
	}
}
