import { APIGatewayProxyEventHeaders, APIGatewayProxyEvent } from 'aws-lambda';

type HandlerResult = {
    result?: Record<string, any>;
    headers?: APIGatewayProxyEventHeaders;
};
type RestRequestConfig = {
    rootDomain: string;
    localHostPort: number;
    allowedCorsPrefixes: string[];
};
declare const restRequestHandler: <P>(handler: (payload: P, headers: APIGatewayProxyEventHeaders) => Promise<HandlerResult | void>) => (event: APIGatewayProxyEvent, _context: any) => Promise<{
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
    };
    body: string;
}>;

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

export { BadGatewayError, BadRequestError, ForbiddenError, MethodNotAllowedError, NotFoundError, type RestRequestConfig, UnauthorizedError, isProd, restRequestHandler };
