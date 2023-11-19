import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders,APIGatewayProxyResult } from "aws-lambda"
import { parseRequest } from "./fns/parseRequest"
import { setCorsHeaders } from "./fns/setCorsHeaders"
import { authenticate } from "./fns/authenticate"

type HandlerResult = {
    result?: Record<string, any>,
    headers?: APIGatewayProxyEventHeaders
}

export type RestRequestConfig = {
    rootDomain: string,
    localHostPort: number,
    allowedCorsPrefixes: string[],
}

export const restRequestHandler = <P, R extends HandlerResult>({
    handler 
}: {
    handler: ( 
        payload: P, 
        headers: APIGatewayProxyEventHeaders
    ) => Promise<R|void>, 
}) => async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try { 
        // Authenticate the request if needed
        const userId = (process.env.AUTHENTICATE === "true") && await authenticate(event)
        // Parse the request
        const payload = parseRequest<P>(event)
        // Handle the request
        const result = await handler({...payload, userId}, event.headers)
        // Return the result
        return {
            statusCode: result?.result?200:204,
            headers: { 
                ...result?.headers,
                ...setCorsHeaders(event, {
                    rootDomain: process.env.ROOT_DOMAIN as string,
                    localHostPort: parseInt(process.env.LOCAL_HOST_PORT as string),
                    allowedCorsPrefixes: (process.env.ALLOWED_CORS_PREFIXES as string).split(','),
                }),
            },
            body: JSON.stringify(result?.result)
        }

    } catch (_e) {
        const error = _e as Error
        // Log the error
        console.error(error)
        // Return the error
        return {
            statusCode: error.statusCode ?? 500,
            headers: {
                ...setCorsHeaders(event, {
                    rootDomain: process.env.ROOT_DOMAIN as string,
                    localHostPort: parseInt(process.env.LOCAL_HOST_PORT as string),
                    allowedCorsPrefixes: (process.env.ALLOWED_CORS_PREFIXES as string).split(','),
                }),
            },
            body: JSON.stringify({
                message: `The following Error occurred: ${process.env.NODE_ENV === 'production'
                    ? error.prodErrorMessage ?? "Internal Server Error"
                    : error.message
                }` 
            })
        }
    }
}

