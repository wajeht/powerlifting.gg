export function getSearchHandler(SearchService) {
	return async (req, res) => {
		const data = await SearchService.search(req.query.q);
		return res.status(200).json({
			message: 'ok',
			data: data,
		});
	};
}
