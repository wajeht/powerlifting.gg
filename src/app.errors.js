function HttpError(statusCode, message) {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
}

export function ForbiddenError(message = 'Forbidden') {
	return HttpError(403, message);
}

export function UnauthorizedError(message = 'Unauthorized') {
	return HttpError(401, message);
}

export function NotFoundError(message = 'Not Found') {
	return HttpError(404, message);
}

export function ValidationError(message = 'Validation Error') {
	return HttpError(422, message);
}

export function UnimplementedFunctionError(message = 'Function Not Implemented') {
	return HttpError(501, message);
}
