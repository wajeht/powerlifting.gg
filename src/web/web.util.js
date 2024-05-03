export function nl2br(str) {
	return str.replace(/(?:\r\n|\r|\n|\t| )/g, function (match) {
		if (match === '\n') {
			return '<br>';
		} else if (match === '\r\n') {
			return '<br>';
		} else if (match === '\r') {
			return '<br>';
		} else if (match === '\t') {
			return '&nbsp;&nbsp;&nbsp;&nbsp;'; // Assuming 4 spaces for a tab
		} else if (match === ' ') {
			return '&nbsp;'; // Replacing space with non-breaking space
		}
	});
}

export function extractDomainName(url) {
	let domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''); // Updated regular expression to handle variations of URLs
	domain = domain.split('/')[0]; // Get only the domain part
	const parts = domain.split('.');
	if (parts.length > 1) {
		// Check if there's a subdomain
		return parts[0];
	} else {
		return domain;
	}
}
