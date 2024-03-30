export function getTenantUsersHandler(UserService) {
	return async (req, res) => {
		const users = await UserService.getTenantUsers(req.tenant.id);
		return res.status(200).json({
			message: 'ok',
			data: users,
		});
	};
}
