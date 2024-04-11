export function getHealthzHandler() {
	return (req, res) => {
		const uptime = process.uptime();
		if (req.get('Content-Type') === 'application/json') {
			return res.status(200).json({ message: 'ok', uptime });
		}

		return res.status(200).render('healthz.html', {
			title: '/healthz',
			uptime,
			layout: '../layouts/healthz.html',
		});
	};
}

export function getTenantsHandler(SearchService) {
	return async (req, res) => {
		const { q, per_page, current_page, sort } = req.query;
		const tenants = await SearchService.search(q, {
			perPage: parseInt(per_page ?? 25),
			currentPage: parseInt(current_page ?? 1),
			sort: sort ?? 'asc',
			cache: true,
		});
		return res.status(200).render('tenants.html', {
			title: '/tenants',
			q: req.query.q,
			tenants,
		});
	};
}

export function getTenantsNewHandler() {
	return async (req, res) => {
		return res.status(200).render('tenants-new.html', {
			title: '/tenants/new',
		});
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
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
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

export function getAdminHandler() {
	return (req, res) => {
		return res.status(200).render('admin.html', {
			title: '/admin',
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getRegisterHandler() {
	return (req, res) => {
		return res.status(200).render('register.html', {
			title: '/register',
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	};
}

export function getLoginHandler() {
	return (req, res) => {
		return res.status(200).render('login.html', {
			title: '/login',
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	};
}

export function getIndexHandler(WebRepository, TenantService) {
	return async (req, res) => {
		if (req.tenant) {
			const users = await WebRepository.getTenantUsers({ tenant_id: req.tenant.id });
			const reviews = await TenantService.getTenantReviews({
				tenantId: req.tenant.id,
				cache: true,
			});
			return res.status(200).render('tenant.html', {
				tenant: JSON.stringify(req.tenant),
				reviews,
				layout: '../layouts/tenant.html',
				users,
				title: '/',
			});
		}

		const tenants = await WebRepository.getRandomTenants({ size: 4 });
		return res.status(200).render('home.html', { tenants, title: '/' });
	};
}

export function getUser(WebService, NotFoundError, UnimplementedFunctionError) {
	return async (req, res) => {
		if (req.body.method === 'DELETE') {
			const user = await WebService.getUser();

			if (!user) throw new NotFoundError();

			return res.redirect('/admin');
		}

		throw new UnimplementedFunctionError();
	};
}
