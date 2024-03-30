export function getHealthzHandler() {
	return (req, res) => {
		return res.status(200).json({ message: 'ok', date: new Date() });
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

export function getRegiserHanlder() {
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

export async function getUser(WebService, NotFoundError, UnimplementedFunctionError) {
	return async (req, res) => {
		if (req.body.method === 'DELETE') {
			const user = await WebService.getUser();

			if (!user) throw new NotFoundError();

			return res.redirect('/admin');
		}

		throw new UnimplementedFunctionError();
	};
}
