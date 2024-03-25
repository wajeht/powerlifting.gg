export function getTenantUsersHandler(userService) {
	return async (req, res, next) => {
		try {
			const users = await userService.getTenantUsers(req.tenant.id);
			return res.status(200).json({
				message: 'ok',
				data: users,
			});
		} catch (error) {
			next(error);
		}
	};
}
