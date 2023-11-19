import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

type HandlerResult = {
    result?: Record<string, any>;
    headers?: APIGatewayProxyEventHeaders;
};
declare const restApiHandler: <P, R extends HandlerResult>(config: any, handler: (payload: P, headers: APIGatewayProxyEventHeaders) => Promise<void | R>, opts?: {}) => (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

declare global {
    interface Error {
        statusCode?: number;
        prodErrorMessage?: string;
    }
}
declare class BadRequestError extends Error {
    prodErrorMessage: string;
    constructor(message?: string);
}
declare class UnauthorizedError extends Error {
    prodErrorMessage: string;
    constructor(message?: string);
}
declare class ForbiddenError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
declare class NotFoundError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
declare class MethodNotAllowedError extends Error {
    prodErrorMessage?: string;
    constructor(message?: string);
}
declare class BadGatewayError extends Error {
    prodErrorMessage?: string;
    constructor(service: string, message?: string);
}

declare const isProd: () => boolean;

export { BadGatewayError, BadRequestError, ForbiddenError, MethodNotAllowedError, NotFoundError, UnauthorizedError, isProd, restApiHandler };
