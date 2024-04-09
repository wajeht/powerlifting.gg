export function getHealthzHandler() {
	return (req, res) => {
		const uptime = process.uptime();
		if (req.get('Content-Type') === 'application/json') {
			return res.status(200).json({ message: 'ok', uptime });
		}

		return res.status(200).render('healthz.html', {
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
		});
		return res.status(200).render('tenants.html', {
			q: req.query.q,
			tenants,
		});
	};
}

export function getTenantsNewHandler() {
	return async (req, res) => {
		return res.status(200).render('tenants-new.html', {});
	};
}

export function getContactHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('contact.html', {
				flashMessages: req.flash(),
			});
		}

		return res.status(200).render('contact.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	};
}

export function getPrivacyPolicyHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('privacy-policy.html');
		}

		return res.status(200).render('privacy-policy.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getTermsOfServiceHandler() {
	return (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('terms-of-services.html');
		}

		return res.status(200).render('terms-of-services.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getAdminHandler() {
	return (req, res) => {
		return res.status(200).render('admin.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	};
}

export function getRegisterHandler() {
	return (req, res) => {
		return res.status(200).render('register.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	};
}

export function getLoginHandler() {
	return (req, res) => {
		return res.status(200).render('login.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	};
}

export function getIndexHandler(WebRepository) {
	return async (req, res) => {
		if (req.tenant) {
			const users = await WebRepository.getTenantUsers({ tenant_id: req.tenant.id });
			return res.status(200).render('tenant.html', {
				tenant: JSON.stringify(req.tenant),
				layout: '../layouts/tenant.html',
				users,
			});
		}

		// TODO: grab top 5 coaches
		const tenants = await WebRepository.getTenants();
		return res.status(200).render('home.html', { tenants: tenants.slice(0, 5) });
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
