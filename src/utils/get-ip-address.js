export function getIpAddress(req) {
	const xForwardedFor = req.headers['x-forwarded-for'];

	let clientIp = '';

	if (Array.isArray(xForwardedFor)) {
		clientIp = xForwardedFor[0].split(',')[0].trim();
	}

	if (typeof xForwardedFor === 'string') {
		clientIp = xForwardedFor.split(',')[0].trim();
	}

	if (!clientIp) {
		clientIp = req.ip || req.socket?.remoteAddress || '';
	}

	return clientIp;
}
