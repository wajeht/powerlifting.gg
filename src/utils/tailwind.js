import { db } from '../database/db.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

(async () => {
	setTimeout(async () => {
		const tailwindDotHtml = path.resolve(
			path.join(process.cwd(), 'src', 'views', 'components', 'tailwind.html'),
		);

		try {
			const file = await fs.readFile(tailwindDotHtml, 'utf-8');

			const colors = (await db.select('color').from('tenants')).map(
				(color) => `bg-[${color.color}]`,
			);
			const fileWithColors = file.replace(/class="([^"]*)"/, `class="${colors.join(' ')}"`);

			await fs.writeFile(tailwindDotHtml, fileWithColors, 'utf-8');

			logger.debug('generating tailwind classes =>', `${colors.join(', ')}`);

			process.exit(0);
		} catch (error) {
			logger.error(error);
		}
	}, 60000);
})();
