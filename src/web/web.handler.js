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

export function getTenantsNewHandler() {
	return async (req, res) => {
		return res.status(200).render('tenants-create.html', {
			title: '/tenants/create',
		});
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

		return res.redirect('/');
	};
}

export function postContactHandler(sendContactEmail) {
	return (req, res) => {
		sendContactEmail(req.body);
		req.flash('info', "Thanks for reaching out to us, we'll get back to you shortly!");
		return res.redirect('/contact');
	};
}

export function getContactHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('contact.html', {
				title: '/contact',
				flashMessages: req.flash(),
			});
		}

		return res.status(200).render('contact.html', {
			title: '/contact',
			flashMessages: req.flash(),
			layout: '../layouts/tenant.html',
			tenant: JSON.stringify(req.tenant),
		});
	};
}

export function getPrivacyPolicyHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('privacy-policy.html', {
				title: '/privacy-policy',
			});
		}

		return res.status(200).render('privacy-policy.html', {
			title: '/privacy-policy',
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getTermsOfServiceHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('terms-of-services.html', {
				title: '/terms-of-services',
			});
		}

		return res.status(200).render('terms-of-services.html', {
			title: '/terms-of-services',
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getIndexHandler(WebRepository, TenantService) {
	return async (req, res) => {
		if (req.tenant) {
			const reviews = await TenantService.getTenantReviews({
				tenantId: req.tenant.id,
				cache: true,
			});
			return res.status(200).render('tenant.html', {
				tenant: req.tenant,
				reviews,
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

export function postReviewHandler(TenantService) {
	return async (req, res) => {
		const { user_id, tenant_id, comment, ratings } = req.body;

		if (comment.trim() === '') {
			req.flash('error', 'for real, say some!');
			return res.redirect('back');
		}

		await TenantService.addReviewToTenant({
			user_id: parseInt(user_id),
			tenant_id: parseInt(tenant_id),
			ratings: parseInt(ratings),
			comment: `${comment}`,
		});

		return res.redirect('back');
	};
}
