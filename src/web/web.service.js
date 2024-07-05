import { marked } from 'marked';
import readingTime from 'reading-time';
import matter from 'gray-matter';
import path from 'node:path';
import fs from 'node:fs/promises';
import { extractDomainName } from './web.util.js';

export function WebService(WebRepository, redis, job) {
	return {
		deleteTenant: async function (tenantId) {
			await WebRepository.deleteTenant(tenantId);
			await this.clearSystemWideCache();
		},
		getTenant: async function ({ tenantId, cache = true }) {
			if (!cache) {
				return await WebRepository.getTenant(tenantId);
			}

			let tenant = await redis.get(`tenants-${tenantId}`);

			if (!tenant) {
				tenant = await WebRepository.getTenant(tenantId);

				await redis.set(`tenants-${tenantId}`, JSON.stringify(tenant));
			} else {
				tenant = JSON.parse(tenant);
			}

			return tenant;
		},
		getAllMyTenants: async function (userId) {
			return await WebRepository.getAllMyTenants(userId);
		},
		getSubscription: async function (email) {
			return await WebRepository.getSubscription(email);
		},
		updateSubscription: async function ({ email, type }) {
			return await WebRepository.updateSubscription({ email, type });
		},
		createSubscription: async function ({ email, type }) {
			return await WebRepository.postSubscription({ email, type });
		},
		subscribeToNewsletter: async function (email) {
			const subscriptions = await this.getSubscription(email);

			if (subscriptions) {
				const type = JSON.parse(subscriptions.type);
				type.newsletter = true;
				return await WebRepository.updateSubscription({ email, type });
			}

			// TODO: send a user for email confirmation to make sure it is an actual email
			//       check to see if valid user from `users` table
			const type = { newsletter: true, changelog: false, promotion: false };
			return await WebRepository.postSubscription({ email, type });
		},
		clearSystemWideCache: async function () {
			const keys = await redis.keys('*');
			for (const key of keys) {
				await redis.del(key);
			}
		},
		deleteAccount: async function ({ id }) {
			await WebRepository.deleteUser({ id });
			return this.clearSystemWideCache();
		},
		updateUser: async function ({ id, updates }) {
			return await WebRepository.updateUser({ id, updates });
		},
		getUser: async function ({ id, tenant_id }) {
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
		getMarkdownPage: async function ({ cache = true, page }) {
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
			for (let i = 0; i < posts.length; i++) {
				const currentPost = posts[i];
				if (currentPost.meta.id === id) {
					if (cache) {
						await redis.set(`blog-post-${id}`, JSON.stringify(currentPost));
					}
					return {
						previous: posts[i - 1] || null,
						post: currentPost,
						next: posts[i + 1] || null,
					};
				}
			}
			return null;
		},
		postTenant: async function ({
			logo = '',
			banner = '',
			slug,
			name,
			links,
			verified = false,
			approved = false,
			user_id,
		}) {
			const [tenant] = await WebRepository.postTenant({
				logo,
				banner,
				slug,
				name,
				approved,
				links,
				verified,
			});

			let coach = {};
			if (verified) {
				// TODO: do only one db call
				await WebRepository.postCoach({ user_id, tenant_id: tenant.id, role: 'HEAD_COACH' });
				coach = await WebRepository.getUser({ id: user_id });
			}

			// clear tenants cache
			const keys = await redis.keys('*');
			for (const i of keys) {
				if (i.startsWith('search?q=&per_page=')) {
					await redis.del(i);
				}
			}

			// send email to admin
			if (!approved) {
				await job.sendApproveTenantEmailJob({ tenant, coach });
			}

			// generate og image for seo
			if (banner) {
				await job.generateOgImageJob({ tenant });
			}
		},
		updateTenant: async function (id, updates) {
			if (Object.keys(updates).length === 0) {
				throw new Error('No fields to update');
			}

			let links = updates.links;
			if (links && links.length) {
				links = links
					.split(',')
					.map((s) => s.trim())
					.map((s) => ({
						type: extractDomainName(s),
						url: s,
					}));
			} else {
				links = [];
			}

			const formattedUpdates = {
				...updates,
				links,
			};

			const [tenant] = await WebRepository.updateTenant(id, formattedUpdates);

			const keys = await redis.keys('*');
			for (const i of keys) {
				if (i.startsWith('search?q=&per_page=')) {
					await redis.del(i);
				}

				if (i === `tenants-${id}`) {
					await redis.del(i);
				}
			}

			if ('banner' in updates) {
				await job.generateOgImageJob({ tenant });
			}

			return tenant;
		},
		postContact: async function ({ email, message, subject }) {
			await job.sendContactEmailJob({ email, message, subject });
		},
		sendNewReviewEmailJob: async function ({ tenant_id, user_id, review }) {
			await job.sendNewReviewEmailJob({ tenant_id, user_id, review });
		},
		calibrateRatingsJob: async function ({ ids }) {
			await job.calibrateRatingsJob({ ids });
		},
		generateOgImageJob: async function ({ tenant }) {
			await job.generateOgImageJob({ tenant });
		},
		exportTenantReviewsJob: async function ({ tenant, user }) {
			await job.exportTenantReviewsJob({ tenant, user });
		},
	};
}
