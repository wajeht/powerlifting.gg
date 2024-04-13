export async function seed(db) {
	const fixedUsers = [
		{
			username: 'super-admin',
			email: 'super-admin@test.com',
			role: 'SUPER_ADMIN',
		},
		{
			username: 'admin',
			email: 'admin@test.com',
			role: 'ADMIN',
		},
		{
			username: 'user',
			email: 'user@test.com',
			role: 'USER',
		},
	];

	for (const user of fixedUsers) {
		const existingUser = await db('users').where('email', user.email).first();
		if (!existingUser) {
			await db('users').insert(user);
		}
	}
}
