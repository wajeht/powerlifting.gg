export function SearchService(db) {
	return {
		search: async (q) => {
			return await db.select('*').from('tenants').where('name', 'like', `%${q}%`);
		},
	};
}
