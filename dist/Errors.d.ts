declare global {
    interface Error {
        statusCode?: number;
        prodErrorMessage?: string;
    }
}
export declare class BadRequestError extends Error {
    prodErrorMessage: string;
    constructor(message?: string);
}
export declare class UnauthorizedError extends Error {
    prodErrorMessage: string;
    constructor(message?: string);
}
export declare class ForbiddenError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
export declare class NotFoundError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
export declare class MethodNotAllowedError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
export declare class BadGatewayError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
