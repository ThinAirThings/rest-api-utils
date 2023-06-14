"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadGatewayError = exports.MethodNotAllowedError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message = 'Bad Request') {
        super(message);
        this.prodErrorMessage = 'Bad Request';
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.prodErrorMessage = 'Unauthorized';
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.prodErrorMessage = 'Forbidden';
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.prodErrorMessage = 'Not Found';
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class MethodNotAllowedError extends Error {
    constructor(message = 'Method Not Allowed') {
        super(message);
        this.prodErrorMessage = 'Method Not Allowed';
        this.name = 'MethodNotAllowedError';
        this.statusCode = 405;
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class BadGatewayError extends Error {
    constructor(service, message = 'Bad Gateway') {
        super(`Error in: ${service}: ${message}`);
        this.prodErrorMessage = 'Bad Gateway';
        this.name = 'BadGatewayError';
        this.statusCode = 502;
    }
}
exports.BadGatewayError = BadGatewayError;
