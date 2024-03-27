import { db } from '../database/db.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';
import cp from 'child_process';
import { env } from '../conifg/env.js';

export async function generateTailwindColors() {
	const tailwindDotHtml = path.resolve(
		path.join(process.cwd(), 'src', 'views', 'components', 'tailwind.html'),
	);

	try {
		const file = await fs.readFile(tailwindDotHtml, 'utf-8');

		const colors = (await db.select('color').from('tenants')).map((color) => `bg-[${color.color}]`);
		const fileWithColors = file.replace(/class="([^"]*)"/, `class="${colors.join(' ')}"`);

		await fs.writeFile(tailwindDotHtml, fileWithColors, 'utf-8');

		logger.debug('generating tailwind classes =>', `${colors.join(', ')}`);

		if (env.env === 'production') {
			cp.exec('npm run build:tailwind');
		}
	} catch (error) {
		logger.error(error);
	}
}
