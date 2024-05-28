import './env.js';

export const discord = Object.freeze({
	id: process.env.DISCORD_ID,
	token: process.env.DISCORD_TOKEN,
	url: process.env.DISCORD_URL,
});
