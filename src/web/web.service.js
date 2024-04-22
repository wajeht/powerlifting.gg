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
		getBlogPosts: async ({ cache = true }) => {
			console.log(cache);
			let postFiles = await fs.readdir(path.resolve(process.cwd(), 'src', 'web', 'pages', 'blog'));
			postFiles = postFiles
				.filter((file) => file.endsWith('.md'))
				.map(async (file) => {
					const filePath = path.resolve(process.cwd(), 'src', 'web', 'pages', 'blog', file);
					const stats = await fs.stat(filePath);
					return {
						title: path.basename(file, '.md'),
						id: file.split('.md')[0],
						date: stats.birthtime,
					};
				})
				.reverse();

			return Promise.all(postFiles);
		},
	};
}
