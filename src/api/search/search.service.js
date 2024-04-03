export function SearchService(db) {
	return {
		search: async (q) => {
			if (q === '') return [];
			return await db.select('*').from('tenants').where('name', 'like', `%${q}%`).orderBy('name');
		},
	};
}
