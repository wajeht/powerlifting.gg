import { NotFoundError } from '../app.error.js';
import { extractDomainName } from './web.util.js';

export function getHealthzHandler() {
	return (req, res) => {
		const uptime = process.uptime();
		if (req.get('Content-Type') === 'application/json') {
			return res.status(200).json({ message: 'ok', uptime });
		}

		return res.status(200).render('healthz.html', {
			uptime,
			title: 'Healthz',
			path: '/healthz',
			layout: '../layouts/healthz.html',
		});
	};
}

export function getTenantsHandler(TenantService) {
	return async (req, res) => {
		const { q, per_page, current_page, sort } = req.query;
		const tenants = await TenantService.getApprovedTenantSearch(q, {
			cache: true,
			sort: sort ?? 'asc',
			perPage: parseInt(per_page ?? 25),
			currentPage: parseInt(current_page ?? 1),
		});
		return res.status(200).render('tenants.html', {
			tenants,
			q: req.query.q,
			title: 'Tenants',
			path: '/tenants'
		});
	};
}

export function getTenantsCreateHandler() {
	return async (req, res) => {
		return res.status(200).render('tenants-create.html', {
			flashMessages: req.flash(),
			title: 'Tenants / Create',
			path: '/tenants/create',
		});
	};
}

export function postTenantHandler(WebService) {
	return async (req, res) => {
		let { name, slug, social, verified } = req.body;

		const logo = req.files?.logo?.[0];
		const banner = req.files?.banner?.[0];

		if (verified === 'on') {
			verified = true;
		} else {
			verified = false;
		}

		// TODO: put this inside service
		let links = social;
		if (links && links.length) {
			links = social
				.split(',')
				.map((s) => s.trim())
				.map((s) => ({
					type: extractDomainName(s),
					url: s,
				}));
		} else {
			links = [];
		}

		await WebService.postTenant({
			verified,
			links,
			name,
			slug,
			banner: banner?.location || '',
			logo: logo?.location || '',
			user_id: req.session.user.id,
		});

		req.flash(
			'info',
			"Thank you for submitting the tenant information. We'll review the details and get back to you with approval soon!",
		);
		return res.redirect('/tenants/create');
	};
}

export function getLoginHandler() {
	return async (req, res) => {
		if (req.session.user) {
			return res.redirect('back');
		}
		return res.redirect('/oauth/google');
	};
}

export function getSettingsHandler() {
	return async (req, res) => {
		return res.status(200).render('./settings/settings.html', {
			flashMessages: req.flash(),
			title: 'Settings',
			path: '/settings',
			layout: '../layouts/settings.html',
		});
	};
}

export function getSettingsTenantHandler() {
	return async (req, res) => {
		return res.status(200).render('./settings/tenant.html', {
			flashMessages: req.flash(),
			title: 'Settings / Tenant',
			path: '/settings/tenant',
			layout: '../layouts/settings.html',
		});
	};
}

export function getLogoutHandler() {
	return async (req, res) => {
		if (req.session && req.session.user) {
			req.session.user = undefined;
			req.session.destroy((error) => {
				if (error) {
					throw new Error(error);
				}
			});
		}

		return res.redirect('back');
	};
}

export function postContactHandler(WebService) {
	return async (req, res) => {
		await WebService.postContact(req.body);
		req.flash('info', "Thanks for reaching out to us, we'll get back to you shortly!");
		return res.redirect('/contact');
	};
}

export function getContactHandler() {
	return (req, res) => {
		return res.status(200).render('contact.html', {
			title: 'Contact',
			path: '/contact',
			flashMessages: req.flash(),
		});
	};
}

export function getPrivacyPolicyHandler(WebService) {
	return async (req, res) => {
		const content = await WebService.getMarkdownPage({ cache: true, page: 'privacy-policy' });
		return res.status(200).render('markdown.html', {
			title: 'Privacy Policy',
			path: '/privacy-policy',
			content,
		});
	};
}

export function getTermsOfServiceHandler(WebService) {
	return async (req, res) => {
		const content = await WebService.getMarkdownPage({ cache: true, page: 'terms-of-services' });
		return res.status(200).render('markdown.html', {
			title: 'Terms of Services',
			path: '/terms-of-services',
			content,
		});
	};
}

export function getIndexHandler(WebRepository, TenantService) {
	return async (req, res) => {
		if (req.tenant) {
			const { q, per_page, current_page, sort } = req.query;
			const reviews = await TenantService.getApprovedTenantReviews(q, req.tenant.id, {
				cache: true,
				sort: sort ?? 'desc',
				perPage: parseInt(per_page ?? 25),
				currentPage: parseInt(current_page ?? 1),
			});
			return res.status(200).render('tenant.html', {
				tenant: req.tenant,
				reviews,
				q: req.query.q,
				flashMessages: req.flash(),
				title: 'Powerlifting.gg',
				path: '/',
				layout: '../layouts/tenant.html',
			});
		}

		// TODO: do this at the database so we dont gotta iterate
		//       another modification the second time here
		const tenants = (await WebRepository.getRandomApprovedTenants({ size: 5 })).map((r) => {
			let ratings = r.ratings;

			if (ratings == null) {
				ratings = 0;
			} else {
				ratings =
					ratings.toString().split('').length > 1 ? parseFloat(ratings.toFixed(1)) : ratings;
			}

			return {
				...r,
				ratings,
			};
		});
		const reviews = await WebRepository.getRandomReviews({ size: 10 });
		return res.status(200).render('home.html', { tenants, reviews, title: 'Powerlifting.gg', path: '/' });
	};
}

export function getReviewsHandler() {
	return async (req, res) => {
		return res.redirect(res.locals.app.configureDomain(res.locals.app.tenant.slug));
	};
}

export function postReviewHandler(TenantService) {
	return async (req, res) => {
		if (!req.tenant) {
			throw new NotFoundError();
		}

		const { user_id, tenant_id, comment, ratings } = req.body;

		if (comment.trim() === '') {
			req.flash('error', 'for real, say some!');
			return res.redirect('back');
		}

		await TenantService.addReviewToTenant({
			user_id: parseInt(user_id),
			tenant_id: parseInt(tenant_id),
			ratings: parseInt(ratings),
			comment: comment.trim(),
		});

		return res.redirect('back');
	};
}

export function getBlogHandler(WebService) {
	return async (req, res) => {
		const posts = await WebService.getBlogPosts({ cache: true });

		return res.status(200).render('blog.html', {
			title: 'Blog',
			path: '/blog',
			posts,
		});
	};
}

export function getBlogPostHandler(WebService) {
	return async (req, res) => {
		const post = await WebService.getBlogPost({ cache: true, id: req.params.id });

		return res.status(200).render('post.html', {
			title: `Blog / ${req.params.id}`,
			path: `/blog/title`,
			post,
		});
	};
}
