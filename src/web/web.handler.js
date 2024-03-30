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
