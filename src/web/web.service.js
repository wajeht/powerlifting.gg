import { marked } from 'marked';
import path from 'path';
import fs from 'fs/promises';

export function WebService(WebRepository, redis) {
	return {
		getUser: async ({ id, tenant_id }) => {
			return await WebRepository.getUser({ id, tenant_id });
		},
		/**
		 * Fetches a Markdown page.
		 * @async
		 * @param {Object} options - The options object.
		 * @param {boolean} [options.cache=true] - Whether to cache the fetched page.
		 * @param {'terms-of-services' | 'privacy-policy'} options.page - The name or path of the page to fetch. Should be either 'terms-of-services' or 'privacy-policy'.
		 * @returns {Promise<string>} A promise that resolves with the Markdown content of the fetched page.
		 */
		getMarkdownPage: async ({ cache = true, page }) => {
			if (!cache) {
				const pagePath = path.resolve(
					path.join(process.cwd(), 'src', 'web', 'pages', `${page}.md`),
				);
				return marked(await fs.readFile(pagePath, 'utf8'));
			}

			let markdown = await redis.get(`${page}-md`);

			if (!markdown) {
				const pagePath = path.resolve(
					path.join(process.cwd(), 'src', 'web', 'pages', `${page}.md`),
				);
				markdown = marked(await fs.readFile(pagePath, 'utf8'));
				await redis.set(`${page}-md`, JSON.stringify(markdown));
			} else {
				markdown = JSON.parse(markdown);
			}

			return markdown;
		},
	};
}
