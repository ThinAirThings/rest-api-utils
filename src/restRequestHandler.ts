import {APIGatewayProxyEventHeaders, APIGatewayProxyEvent} from 'aws-lambda'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

export const restRequestHandler = <T>(
    handler: ({payload, headers}: {payload: T, headers: APIGatewayProxyEventHeaders})=>Promise<Partial<{
        body?: any
        headers?: any
    }>>,
    verify?: boolean,
) => async (event: APIGatewayProxyEvent) => {
    // Parse Body
    const inputPayload = typeof event.body === 'object' ? event.body : JSON.parse(event.body)
    // Run lambda
    try {
        if (verify) {
            // Verify Token
            await CognitoJwtVerifier.create({
                userPoolId: process.env.COGNITO__USER_POOL_ID!,
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
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": `${process.env.CORS_DOMAIN}`,
            },
            body: JSON.stringify(outputPayload.body)
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `The following Error occurred: ${(error as Error).message}`
            })
        }
    }
}