import { db } from '../database/db.js';
import { extractDomainName } from './web.util.js';
import { NotFoundError } from '../app.error.js';

export function postCalibrateTenantRatings(WebService) {
	return async (req, res) => {
		await WebService.calibrateRatingsJob({ ids: req.body.id.map((i) => parseInt(i)) });
		req.flash('success', 'calibrated ratings job has been run!');
		return res.redirect('back');
	};
}

export function postExportTenantReviewsHandler(WebService) {
	return async (req, res) => {
		const { id } = req.body;
		const tenant = await WebService.getTenant({ tenantId: id });
		const user = req.session.user;
		await WebService.exportTenantReviewsJob({ tenant, user });
		req.flash('info', 'Your request to generated export has been submitted.');
		return res.redirect('back');
	};
}

export function getUnsubscribeHandler(WebService, NotFoundError) {
	return async (req, res) => {
		const subscriptions = await WebService.getSubscription(req.query.email);

		if (!subscriptions) {
			throw new NotFoundError('The email does not exist within our mailing list!');
		}

		return res.status(200).render('unsubscribe.html', {
			title: 'Unsubscribe',
			path: '/unsubscribe',
			subscriptions: {
				...subscriptions,
				type: JSON.parse(subscriptions.type),
			},
			flashMessages: req.flash(),
		});
	};
}

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
			cache: false,
			sort: sort ?? 'asc',
			perPage: parseInt(per_page ?? 25),
			currentPage: parseInt(current_page ?? 1),
		});
		return res.status(200).render('tenants.html', {
			tenants,
			q: req.query.q,
			title: 'Tenants',
			path: '/tenants',
		});
	};
}

export function postSubscribeToATenant(TenantService, WebService) {
	return async (req, res) => {
		const id = req.params.id;
		const email = req.body.email;
		const tenant = await TenantService.getApprovedTenant({ tenantId: id });
		const subscription = await WebService.getSubscription(email);

		if (!subscription) {
			const type = {
				newsletter: false,
				changelog: false,
				promotion: false,
				tenants: [
					{
						id,
						name: tenant.name,
						subscribed: true,
					},
				],
			};
			await WebService.createSubscription({ email, type });
			req.flash('success', `Successfully subscribed to ${tenant.name}`);
			return res.redirect('back');
		}

		const type = JSON.parse(subscription.type) || {};

		if (!type.tenants) {
			type.tenants = [
				{
					id,
					name: tenant.name,
					subscribed: true,
				},
			];
		} else {
			// string only ==
			const tenantIndex = type.tenants.findIndex((t) => t.id == id);

			if (tenantIndex !== -1) {
				if (!type.tenants[tenantIndex].subscribed) {
					type.tenants[tenantIndex].subscribed = true;
				}
			} else {
				// Tenant does not exist, add a new entry
				type.tenants.push({
					id,
					name: tenant.name,
					subscribed: true,
				});
			}
		}

		await WebService.updateSubscription({ email, type });

		req.flash('success', `Successfully subscribed to ${tenant.name}`);
		return res.redirect('back');
	};
}

export function getTenantsCreateHandler() {
	return async (req, res) => {
		return res.status(200).render('./settings/tenants-create.html', {
			flashMessages: req.flash(),
			title: 'Tenants / Create',
			layout: '../layouts/settings.html',
			path: '/tenants/settings/create',
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

		const autoApproveIfSuperAdmin = req.session.user.role === 'SUPER_ADMIN' ? true : false;

		await WebService.postTenant({
			approved: autoApproveIfSuperAdmin,
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

		return res.redirect('/tenants/settings/create');
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

		return res.redirect("/?alert-success=You've have been logged out!");
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
		const content = await WebService.getMarkdownPage({ cache: false, page: 'privacy-policy' });
		return res.status(200).render('markdown.html', {
			title: 'Privacy Policy',
			path: '/privacy-policy',
			content,
		});
	};
}

export function getTermsOfServiceHandler(WebService) {
	return async (req, res) => {
		const content = await WebService.getMarkdownPage({ cache: false, page: 'terms-of-services' });
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
				cache: false,
				sort: sort ?? 'desc',
				perPage: parseInt(per_page ?? 25),
				currentPage: parseInt(current_page ?? 1),
			});

			let subscribed = false;

			if (req.session?.user) {
				const { email } = req.session.user;
				const subscription = await WebRepository.getSubscription(email);

				if (subscription) {
					const tenants = JSON.parse(subscription.type)?.tenants || [];
					const currentTenantId = req.tenant.id.toString();
					subscribed = tenants.some((tenant) => tenant.id.toString() === currentTenantId && tenant.subscribed); // prettier-ignore
				}
			}

			return res.status(200).render('tenant.html', {
				subscribed: subscribed,
				tenant: req.tenant,
				reviews,
				q: req.query.q,
				flashMessages: req.flash(),
				title: 'Powerlifting.gg',
				path: '/',
				layout: '../layouts/tenant.html',
			});
		}

		const tenants = await WebRepository.getRandomApprovedAndVerifiedTenants({ size: 5 });
		const reviews = await WebRepository.getRandomReviews({ size: 10 });

		return res.status(200).render('home.html', {
			tenants,
			reviews,
			title: 'Powerlifting.gg',
			path: '/',
		});
	};
}

export function getReviewsHandler() {
	return async (req, res) => {
		return res.redirect(res.locals.app.configureDomain(res.locals.app.tenant.slug));
	};
}

export function postReviewHandler(TenantService, WebService) {
	return async (req, res) => {
		let { user_id, tenant_id, comment, ratings } = req.body;

		comment = comment.trim();

		if (comment === '') {
			req.flash('error', 'for real, say some!');
			return res.redirect('back');
		}

		const review = {
			user_id: parseInt(user_id),
			tenant_id: parseInt(tenant_id),
			ratings: parseInt(ratings),
			comment,
		};

		await TenantService.addReviewToTenant(review);
		await WebService.sendNewReviewEmailJob({
			review,
			tenant_id: review.tenant_id,
			user_id: review.user_id,
		});

		req.flash('success', 'comment has been posted successfully!');

		return res.redirect('back');
	};
}

export function getBlogHandler(WebService) {
	return async (req, res) => {
		const posts = await WebService.getBlogPosts({ cache: false });

		return res.status(200).render('blog.html', {
			title: 'Blog',
			path: '/blog',
			posts,
		});
	};
}

export function getBlogPostHandler(WebService) {
	return async (req, res) => {
		const post = await WebService.getBlogPost({ cache: false, id: req.params.id });

		if (post === null) {
			throw new NotFoundError('post does not exist!');
		}

		return res.status(200).render('post.html', {
			title: `Blog / ${req.params.id}`,
			flashMessages: req.flash(),
			path: `/blog/title`,
			post,
		});
	};
}

export function getSettingsHandler(WebService) {
	return async (req, res) => {
		const user = await WebService.getUser({ id: req.session.user.id });
		let subscriptions = await WebService.getSubscription(req.session.user.email);
		if (!subscriptions) {
			subscriptions = {};
			subscriptions.type = {
				newsletter: false,
				changelog: false,
				promotion: false,
			};
		} else {
			subscriptions = {
				...subscriptions,
				type: JSON.parse(subscriptions.type),
			};
		}
		return res.status(200).render('./settings/settings.html', {
			subscriptions,
			user,
			flashMessages: req.flash(),
			title: 'Settings',
			path: '/settings',
			layout: '../layouts/settings.html',
		});
	};
}

export function postSettingsAccountHandler(WebService) {
	return async (req, res) => {
		const { username, email } = req.body;

		if (username !== req.session.user.username || email !== req.session.user.email) {
			await WebService.updateUser({
				id: req.session.user.id,
				updates: {
					username: req.body.username,
					email: req.body.email,
				},
			});
			req.session.user.username = username;
			req.session.user.email = email;
			req.session.save();
		}

		req.flash('success', 'User account settings updated successfully.');
		return res.redirect('/settings');
	};
}

export function postSettingsTenantsImagesHandler(WebService) {
	return async (req, res) => {
		const id = req.params.id;
		const logo = req.files?.logo?.[0];
		const banner = req.files?.banner?.[0];
		await WebService.updateTenant(id, {
			banner: banner?.location || '',
			logo: logo?.location || '',
		});
		req.flash('success', 'Your tenant images have been updated!');
		return res.redirect(`/settings/tenants/${id}`);
	};
}

export function postSettingsTenantsDangerZoneHandler(WebService) {
	return async (req, res) => {
		const id = req.params.id;
		await WebService.deleteTenant(id);
		delete req.session.user.tenant;
		req.session.save();
		return res.redirect('/?alert-success=Your tenant has been deleted!');
	};
}

export function postSettingsDangerZoneHandler(WebService) {
	return async (req, res) => {
		if (req.session && req.session.user) {
			await WebService.deleteAccount({ id: req.session.user.id });
			req.session.user = undefined;
			req.session.destroy((error) => {
				if (error) {
					throw new Error('Something went wrong while logging out!', error);
				}
			});
		}
		return res.redirect('/?alert-success=Your account has been deleted!');
	};
}

export function postSettingsTenantsDetails(WebService) {
	return async (req, res) => {
		const { name, slug, social } = req.body;
		const id = req.params.id;
		await WebService.updateTenant(id, { name, slug, links: social });
		req.flash('success', 'Your tenant details has been updated!');
		return res.redirect(`/settings/tenants/${id}`);
	};
}

export function getSettingsTenantsHandler(WebService) {
	return async (req, res) => {
		const user = req.session.user;
		const tenants = await WebService.getAllMyTenants(user.id);
		return res.status(200).render('./settings/tenants.html', {
			tenants,
			flashMessages: req.flash(),
			title: 'Settings / Tenant',
			path: '/settings/tenants',
			layout: '../layouts/settings.html',
		});
	};
}

export function getSettingsTenantHandler(WebService) {
	return async (req, res) => {
		const tenant = await WebService.getTenant({ tenantId: req.params.id });
		tenant.social = JSON.parse(tenant.links)
			.map((l) => l.url)
			.join(', ');
		return res.status(200).render('./settings/tenant-details.html', {
			tenant,
			flashMessages: req.flash(),
			title: `Settings / Tenant / ${tenant.name}`,
			path: `/settings/tenants/${tenant.id}`,
			layout: '../layouts/settings.html',
		});
	};
}

export function postNewsletterHandler(WebService) {
	return async (req, res) => {
		await WebService.subscribeToNewsletter(req.body.email);
		req.flash('info', 'Successfully subscribed to out newsletter, please confirm your email!');
		if (req.headers.referer) return res.redirect(`${req.headers.referer}#newsletter-container`);
		return res.redirect('back');
	};
}

// TODO: move this to `WebService`
export function postSubscriptionsHandler(WebService) {
	return async (req, res) => {
		let { changelog, promotion, newsletter, email, tenants } = req.body;

		if (changelog === 'on') {
			changelog = true;
		} else {
			changelog = false;
		}

		if (promotion === 'on') {
			promotion = true;
		} else {
			promotion = false;
		}

		if (newsletter === 'on') {
			newsletter = true;
		} else {
			newsletter = false;
		}

		let subscriptions = await WebService.getSubscription(email);

		if (!subscriptions) {
			// this will set all the default subscription to false
			[subscriptions] = await db('subscriptions').insert({ email }).returning('*');
		}

		let type = JSON.parse(subscriptions.type) || {};

		type.newsletter = newsletter;
		type.changelog = changelog;
		type.promotion = promotion;

		type.newsletter = newsletter;
		type.changelog = changelog;
		type.promotion = promotion;

		if (!type.tenants) {
			type.tenants = [];
		}

		if (tenants && tenants.length) {
			for (let i = 0; i < type.tenants.length; i++) {
				for (const t of tenants) {
					if (type.tenants[i].id === t) {
						type.tenants[i].subscribed = true;
					}
				}
			}
		} else {
			type.tenants = type.tenants.map((t) => ({
				...t,
				subscribed: false,
			}));
		}

		await db('subscriptions')
			.where({ email })
			.update({ type: JSON.stringify(type) });

		req.flash('info', 'User subscription settings updated successfully!');
		if (req.headers.referer) return res.redirect(req.headers.referer);
		return res.redirect('back');
	};
}
