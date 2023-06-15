"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restRequestHandler = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const Errors_1 = require("./Errors");
const _1 = require(".");
const corsHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": `${process.env.CORS_DOMAIN}`,
};
const restRequestHandler = (handler, verify) => async (event) => {
    // Parse Body or Query String Parameters
    let inputPayload;
    if (event.httpMethod === 'POST') {
        inputPayload = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    }
    else if (event.httpMethod === 'GET') {
        inputPayload = event.queryStringParameters;
    }
    else {
        throw new Errors_1.BadRequestError('Invalid HTTP method');
    }
    // Run lambda
    try {
        if (verify) {
            // Verify Token
            try {
                await aws_jwt_verify_1.CognitoJwtVerifier.create({
                    userPoolId: process.env.COGNITO__USERPOOL_ID,
                    clientId: process.env.COGNITO__CLIENT_ID,
                    tokenUse: 'access',
                }).verify(event.headers.Authorization.split(' ')[1]);
            }
            catch (_e) {
                const e = _e;
                throw new Errors_1.UnauthorizedError(e.message);
            }
            // Above will throw if verification fails
        }
        const outputPayload = await handler({
            payload: inputPayload,
            headers: event.headers
        });
        return {
            statusCode: outputPayload?.body ? 200 : 204,
            headers: {
                ...outputPayload?.headers,
                ...corsHeaders,
            },
            body: JSON.stringify(outputPayload?.body)
        };
    }
    catch (_e) {
        const error = _e;
        console.error('Error:', error);
        return {
            statusCode: error?.statusCode ?? 500,
            headers: {
                ...corsHeaders,
            },
            body: JSON.stringify({
                message: `The following Error occurred: ${(0, _1.isProd)()
                    ? error.prodErrorMessage ?? "Internal Server Error"
                    : error.message}`
            })
        };
    }
};
exports.restRequestHandler = restRequestHandler;
