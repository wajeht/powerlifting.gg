import { marked } from 'marked';
import readingTime from 'reading-time';
import matter from 'gray-matter';
import path from 'path';
import fs from 'fs/promises';

export function WebService(WebRepository, redis, job) {
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
					path.join(process.cwd(), 'src', 'web', 'views', 'pages', `${page}.md`),
				);
				return marked(await fs.readFile(pagePath, 'utf8'));
			}

			let markdown = await redis.get(`${page}-md`);

			if (!markdown) {
				const pagePath = path.resolve(
					path.join(process.cwd(), 'src', 'web', 'views', 'pages', `${page}.md`),
				);
				markdown = marked(await fs.readFile(pagePath, 'utf8'));
				await redis.set(`${page}-md`, JSON.stringify(markdown));
			} else {
				markdown = JSON.parse(markdown);
			}

			return markdown;
		},
		getBlogPosts: async function ({ cache = true }) {
			if (cache) {
				const cachedPosts = await redis.get('blog-posts');
				if (cachedPosts) {
					return JSON.parse(cachedPosts);
				}
			}

			const postFiles = await fs.readdir(
				path.resolve(process.cwd(), 'src', 'web', 'views', 'pages', 'blog'),
			);

			const posts = [];
			for (const file of postFiles) {
				if (file.endsWith('.md')) {
					const postPath = path.resolve(
						process.cwd(),
						'src',
						'web',
						'views',
						'pages',
						'blog',
						file,
					);
					const postContent = await fs.readFile(postPath, 'utf-8');
					const frontmatter = matter(postContent).data;
					const readingTimeData = readingTime(postContent.replace(/^---\n.*?\n---\n*/ms, ''));
					const user = await WebRepository.getUser({ username: frontmatter.author });

					let profile_picture;

					if (frontmatter.profile_picture) {
						profile_picture = frontmatter.profile_picture;
					} else if (user) {
						profile_picture = user.profile_picture;
					} else {
						profile_picture = '/img/chad.jpeg';
					}

					posts.push({
						meta: {
							id: file.split('.md')[0],
							...frontmatter,
							profile_picture,
							time: { ...readingTimeData },
						},
						content: marked(postContent.replace(/^---\n.*?\n---\n*/ms, '')),
					});
				}
			}

			posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

			if (cache) {
				await redis.set('blog-posts', JSON.stringify(posts));
			}

			return posts;
		},
		getBlogPost: async function ({ cache = true, id }) {
			if (cache) {
				const cachedPost = await redis.get(`blog-posts-${id}`);
				if (cachedPost) {
					return JSON.parse(cachedPost);
				}
			}

			const posts = await this.getBlogPosts({ cache });
			for (const post of posts) {
				if (post.meta.id === id) {
					if (cache) {
						await redis.set(`blog-post-${id}`, JSON.stringify(post));
					}
					return post;
				}
			}
			return null;
		},
		postTenant: async function ({ logo = '', banner = '', slug, name, links }) {
			const [tenant] = await WebRepository.postTenant({ logo, banner, slug, name, links });

			// clear tenants cache
			const keys = await redis.keys('*');
			for (const i of keys) {
				if (i.startsWith('search?q=&per_page=')) {
					await redis.del(i);
				}
			}

			// send email to admin
			await job.sendApproveTenantEmailJob(tenant);
		},
		postContact: async function ({ email, message, subject }) {
			await job.sendContactEmailJob({ email, message, subject });
		},
	};
}
