import logger from './logger.js';
import { app as appConfig } from '../config/app.js';
import { discord as discordConfig } from '../config/app.js';

import axios from 'axios';

/* It sends a message to a Discord channel */
// https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9
export class Discord {
  static async send(msg, object = null) {
    try {
      let params = null;

      // use different format to send if we have object passed in
      if (object == null) {
        params = { username: 'Powerlifting.gg', content: msg };
      } else {
        params = {
          username: 'Powerlifting.gg',
          content: msg,
          embeds: [
            {
              title: msg,
              description: object,
            },
          ],
        };
      }

      let res = null;

      // only send chad message to discord in production environment
      // prettier-ignore
      if (appConfig.env === 'production') {
        res = await axios({ method: 'POST', headers: { 'Content-Type': 'application/json', }, data: JSON.stringify(params), url: discordConfig.url });
        if (res?.status === 204) logger.info(`Chad sent ${msg}`);
      } else {
        logger.warn(`Skipping Chad message in dev environment!`)
      }
    } catch (e) {
      logger.error(e);
    }
  }
}
