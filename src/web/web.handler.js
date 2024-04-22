import { NotFoundError } from '../app.error.js';

export function getHealthzHandler() {
	return (req, res) => {
		const uptime = process.uptime();
		if (req.get('Content-Type') === 'application/json') {
			return res.status(200).json({ message: 'ok', uptime });
		}

		return res.status(200).render('healthz.html', {
			uptime,
			title: '/healthz',
			layout: '../layouts/healthz.html',
		});
	};
}

export function getTenantsHandler(TenantService) {
	return async (req, res) => {
		const { q, per_page, current_page, sort } = req.query;
		const tenants = await TenantService.getTenantSearch(q, {
			cache: true,
			sort: sort ?? 'asc',
			perPage: parseInt(per_page ?? 25),
			currentPage: parseInt(current_page ?? 1),
		});
		return res.status(200).render('tenants.html', {
			tenants,
			q: req.query.q,
			title: '/tenants',
		});
	};
}

export function getTenantsCreateHandler() {
	return async (req, res) => {
		return res.status(200).render('tenants-create.html', {
			flashMessages: req.flash(),
			title: '/tenants/create',
		});
	};
}

export function postTenantHandler() {
	return async (req, res) => {
		req.flash('info', 'successfully created!');
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
		if (req.tenant) {
			throw new NotFoundError();
		}
		return res.status(200).render('settings.html', {
			flashMessages: req.flash(),
			title: '/settings',
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

export function postContactHandler(sendContactEmailJob) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}
		await sendContactEmailJob(req.body);
		req.flash('info', "Thanks for reaching out to us, we'll get back to you shortly!");
		return res.redirect('/contact');
	};
}

export function getContactHandler() {
	return (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}

		return res.status(200).render('contact.html', {
			title: '/contact',
			flashMessages: req.flash(),
		});
	};
}

export function getPrivacyPolicyHandler(WebService) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}
		const content = await WebService.getMarkdownPage({ cache: true, page: 'privacy-policy' });
		return res.status(200).render('markdown.html', {
			title: '/privacy-policy',
			content,
		});
	};
}

export function getTermsOfServiceHandler(WebService) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}
		const content = await WebService.getMarkdownPage({ cache: true, page: 'terms-of-services' });
		return res.status(200).render('markdown.html', {
			title: '/terms-of-services',
			content,
		});
	};
}

export function getModerationPolicyHandler(WebService) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}
		const content = await WebService.getMarkdownPage({ cache: true, page: 'moderation-policy' });
		return res.status(200).render('markdown.html', {
			title: '/moderation-policy',
			content,
		});
	};
}

export function getIndexHandler(WebRepository, TenantService) {
	return async (req, res) => {
		if (req.tenant) {
			const { q, per_page, current_page, sort } = req.query;
			const reviews = await TenantService.getTenantReviews(q, req.tenant.id, {
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
				title: '/',
				layout: '../layouts/tenant.html',
			});
		}

		const tenants = await WebRepository.getRandomTenants({ size: 5 });
		const reviews = await WebRepository.getRandomReviews({ size: 10 });
		return res.status(200).render('home.html', { tenants, reviews, title: '/' });
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
		if (req.tenant) {
			throw new NotFoundError();
		}
		const posts = await WebService.getBlogPosts({ cache: true });

		return res.status(200).render('blog.html', {
			title: '/blog',
			posts,
		});
	};
}
