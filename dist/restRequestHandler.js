"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restRequestHandler = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const restRequestHandler = (handler, verify) => async (event) => {
    // Parse Body
    console.log("In restApiHandler");
    console.log("event: ", event);
    const inputPayload = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    console.log("below payload");
    // Run lambda
    try {
        console.log("Above if statememt");
        if (verify) {
            console.log("In if statememt above verify");
            // Verify Token
            await aws_jwt_verify_1.CognitoJwtVerifier.create({
                userPoolId: process.env.COGNITO__USER_POOL_ID,
                clientId: process.env.COGNITO__CLIENT_ID,
                tokenUse: 'access',
            }).verify(event.headers.Authorization.split(' ')[1]);
            console.log("In if statememt below verify");
            // Above will throw if verification fails
        }
        console.log("Before run handler");
        const outputPayload = await handler({
            payload: inputPayload,
            headers: event.headers
        });
        console.log("AFter run handler");
        return {
            statusCode: 200,
            body: JSON.stringify(outputPayload)
        };
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `The following Error occurred: ${error.message}`
            })
        };
    }
};
exports.restRequestHandler = restRequestHandler;
