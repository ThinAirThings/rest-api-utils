import {APIGatewayProxyEventHeaders, APIGatewayProxyEvent} from 'aws-lambda'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

const corsHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": `${process.env.CORS_DOMAIN}`,
}
export const restRequestHandler = <T>(
    handler: ({payload, headers}: {payload: T, headers: APIGatewayProxyEventHeaders})=>Promise<Partial<{
        body?: any
        headers?: any
    }>>,
    verify?: boolean,
) => async (event: APIGatewayProxyEvent) => {
    // Parse Body or Query String Parameters
    let inputPayload: T;
    if (event.httpMethod === 'POST') {
        inputPayload = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    } else if (event.httpMethod === 'GET') {
        inputPayload = event.queryStringParameters as T;
    } else {
        throw new Error('Invalid HTTP method');
    }
    // Run lambda
    try {
        if (verify) {
            // Verify Token
            await CognitoJwtVerifier.create({
                userPoolId: process.env.COGNITO__USERPOOL_ID!,
                clientId: process.env.COGNITO__CLIENT_ID!,
                tokenUse: 'access',
            }).verify(event.headers.Authorization!.split(' ')[1])
            // Above will throw if verification fails
        }
        const outputPayload = await handler({
            payload: inputPayload,
            headers: event.headers
        })
        return {
            statusCode: 200,
            headers: {
                ...outputPayload.headers,
                ...corsHeaders,
            },
            body: JSON.stringify(outputPayload.body)
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                ...corsHeaders,
            },
            body: JSON.stringify({
                errorMessage: `The following Error occurred: ${(error as Error).message}` 
            })
        }
    }
}