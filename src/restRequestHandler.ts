import {APIGatewayProxyEventHeaders, APIGatewayProxyEvent} from 'aws-lambda'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { BadRequestError, UnauthorizedError } from './Errors'
import { isProd } from '.'

const corsHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": `${process.env.CORS_DOMAIN}`,
}

export const restRequestHandler = <T>(
    handler: ({payload, headers}: {payload: T, headers: APIGatewayProxyEventHeaders})=>Promise<Partial<{
        body?: any
        headers?: any
    }>|void>,
    verify?: boolean,
) => async (event: APIGatewayProxyEvent) => {
    // Parse Body or Query String Parameters
    let inputPayload: T;
    if (event.httpMethod === 'POST') {
        inputPayload = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    } else if (event.httpMethod === 'GET') {
        inputPayload = event.queryStringParameters as T;
    } else {
        throw new BadRequestError('Invalid HTTP method');
    }
    // Run lambda
    try {
        if (verify) {
            // Verify Token
            try {
                await CognitoJwtVerifier.create({
                    userPoolId: process.env.COGNITO__USERPOOL_ID!,
                    clientId: process.env.COGNITO__CLIENT_ID!,
                    tokenUse: 'access',
                }).verify(event.headers.Authorization!.split(' ')[1])
            } catch (_e) {
                const e = _e as Error
                throw new UnauthorizedError(e.message)
            }
            // Above will throw if verification fails
        }
        const outputPayload = await handler({
            payload: inputPayload,
            headers: event.headers
        })
        return {
            statusCode: outputPayload?.body?200:204,
            headers: {
                ...outputPayload?.headers,
                ...corsHeaders,
            },
            body: JSON.stringify(outputPayload?.body)
        }
    } catch (_e) {
        const error = _e as Error
        console.error('Error:', error);
        return {
            statusCode: error?.statusCode ?? 500,
            headers: {
                ...corsHeaders,
            },
            body: JSON.stringify({
                message: `The following Error occurred: ${isProd()
                    ? error.prodErrorMessage ?? "Internal Server Error"
                    :error.message
                }` 
            })
        }
    }
}